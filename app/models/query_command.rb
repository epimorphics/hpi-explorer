class QueryCommand < DataService
  include ValueFormatter

  RESULTS_SAMPLE = 5

  attr_reader :results, :all_results, :columns

  def initialize( preferences )
    super
  end

  def load_query_results( options = {} )
    hpi = dataset( :hpi )
    query = add_sort(
              add_date_range_constraint(
                add_location_constraint(
                  base_query ) ) )

    Rails.logger.debug "About to ask DsAPI query: #{query.to_json}"
    @all_results = hpi.query( query )
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

  def add_location_constraint( query )
    query.eq( "hpi:refRegion", {"@id" => preferences.selected_location_uri} )
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
    cols = [{aspect: "hpi:refPeriod", label: "Date", sType: "yearmonth"}]

    {m_hpi:  {aspect: "hpi:indicesSASM",                     label: "Index",                         sType: "string"},
     m_chm:  {aspect: "hpi:monthlyChange",                   label: "Monthly change",                sType: "number"},
     m_chy:  {aspect: "hpi:annualChange",                    label: "Yearly change",                 sType: "number"},
     m_vol:  {aspect: "hpi:salesVolume",                     label: "Sales volume",                  sType: "number"},
     m_ap:   {aspect: "hpi:averagePricesSASM",               label: "Average price (all)",           sType: "currency"},
     m_apd:  {aspect: "hpi:averagePricesDetachedSASM",       label: "Average price (detached)",      sType: "currency"},
     m_apsd: {aspect: "hpi:averagePricesSemiDetachedSASM",   label: "Average price (semi-detached)", sType: "currency"},
     m_apt:  {aspect: "hpi:averagePricesTerracedSASM",       label: "Average price (terraced)",      sType: "currency"},
     m_apf:  {aspect: "hpi:averagePricesFlatMaisonetteSASM", label: "Average price (flats)",         sType: "currency"}
    }.each do |key, index|
      cols << index if param(key)
    end

    cols
  end

  def select_visible_results( all_results, columns, options )
    r = ((n = options[:limit]) == :all) ? all_results : all_results.first( n )
    r.map do |result|
      columns.map {|col| format_value( result, col )}
    end
  end

end
