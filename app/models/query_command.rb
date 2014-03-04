class QueryCommand < DataService
  include ValueFormatter

  RESULTS_SAMPLE = 5

  ASPECTS = {m_hpi:  {aspect: "hpi:indicesSASM",                     label: "Index",                         sType: "string"},
     m_chm:  {aspect: "hpi:monthlyChange",                   label: "Monthly change",                sType: "number"},
     m_chy:  {aspect: "hpi:annualChange",                    label: "Yearly change",                 sType: "number"},
     m_vol:  {aspect: "hpi:salesVolume",                     label: "Sales volume",                  sType: "number"},
     m_ap:   {aspect: "hpi:averagePricesSASM",               label: "Average price (all)",           sType: "currency"},
     m_apd:  {aspect: "hpi:averagePricesDetachedSASM",       label: "Average price (detached)",      sType: "currency"},
     m_apsd: {aspect: "hpi:averagePricesSemiDetachedSASM",   label: "Average price (semi-detached)", sType: "currency"},
     m_apt:  {aspect: "hpi:averagePricesTerracedSASM",       label: "Average price (terraced)",      sType: "currency"},
     m_apf:  {aspect: "hpi:averagePricesFlatMaisonetteSASM", label: "Average price (flats)",         sType: "currency"}
    }

  attr_reader :results, :all_results, :columns
  attr_reader :search_id_0, :search_id_1

  def initialize( preferences )
    super

    @search_id_0 = preferences.search_id( 0 )
    @search_id_1 = preferences.search_id( 1 )
    @all_results = Hash.new
  end

  def load_query_results( options = {} )
    hpi = dataset( :hpi )
    non_loc_query = add_sort(
                      add_date_range_constraint(
                        base_query ) )

    query_0 = add_location_constraint( non_loc_query, search_id_0 )
    query_1 = add_location_constraint( non_loc_query, search_id_1 ) if compare_areas?

    Rails.logger.debug "About to ask DsAPI query_0: #{query_0.to_json}"
    Rails.logger.debug "About to ask DsAPI query_1: #{query_1.to_json}" if query_1

    @all_results[search_id_0.sym] = hpi.query( query_0 )
    @all_results[search_id_1.sym] = hpi.query( query_1 ) if query_1

    @columns = visible_columns
    @results = select_visible_results( @all_results, @columns,
                                       {limit: RESULTS_SAMPLE}.merge( options ) )
  end

  # Return the types of the visible columns
  def col_types
    columns.each_with_index.map do |col, i|
      "#{i > 0 ? ', ' : ''}{ 'sType': '#{col[:sType]}' }"
    end .join( " " )
  end

  private

  def compare_areas?
    preferences.compare_areas?
  end

  def add_location_constraint( query, search_id )
    query.eq( "hpi:refRegion", {"@id" => preferences.selected_location_uri( search_id )} )
  end

  def add_date_range_constraint( query )
    query.ge( "hpi:refPeriod", date_from )
         .le( "hpi:refPeriod", date_to )
  end

  def date_from
    date_value( :from_y, :from_m )
  end

  def date_to
    date_value( :to_y, :to_m )
  end

  def date_value( key_y, key_m )
    {"@value" => format('%04d-%02d', param(key_y), param(key_m) ),
     "@type" => "http://www.w3.org/2001/XMLSchema#gYearMonth"}
  end

  def add_sort( query )
    query.sort( :down, "hpi:refPeriod" )
  end

  def visible_columns
    cols = [{aspect: "hpi:refPeriod", label: "Date", sType: "yearmonth", query_id: search_id_0.sym}]

    [search_id_0, search_id_1].each do |search_id|
      if @all_results[search_id.sym]
        ASPECTS.each do |key, index|
          if param(key)
            cols << index.merge( {query_id: search_id.sym, location: preferences.selected_location_name( search_id )} )
          end
        end
      end
    end

    cols
  end

  def select_visible_results( all_results, columns, options )
    limit = ((n = options[:limit]) == :all) ? all_results[search_id_0.sym].length : n
    vr = []

    limit.times do |i|
      vr << columns.map {|col| format_value( all_results, i, col )}
    end

    vr
  end

end
