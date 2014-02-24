class QueryCommand < DataService
  RESULTS_SAMPLE = 5

  attr_reader :results, :all_results, :columns

  def initialize( preferences )
    super
  end

  def load_query_results
    hpi = dataset( :hpi )
    query = add_sort(
              add_date_range_constraint(
                add_location_constraint(
                  base_query ) ) )

    Rails.logger.debug "About to ask DsAPI query: #{query.to_json}"
    @all_results = hpi.query( query )
    @columns = visible_columns
    @results = select_visible_results( @all_results, @columns )
  end

  private

  def add_location_constraint( query )
    query.eq( "hpi:refRegionName", preferences.selected_location_name )
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
    cols = [{aspect: "hpi:refPeriod", label: "Date"}]

    {m_hpi:  {aspect: "hpi:indicesSASM", label: "Index"},
     m_ap:   {aspect: "hpi:averagePricesSASM", label: "Average price"},
     m_apd:  {aspect: "hpi:averagePricesDetachedSASM", label: "Average price (detached)"},
     m_apsd: {aspect: "hpi:averagePricesSemiDetachedSASM", label: "Average price (semi-detached"},
     m_apt:  {aspect: "hpi:averagePricesTerracedSASM", label: "Average price (terraced)"},
     m_apf:  {aspect: "hpi:averagePricesFlatMaisonetteSASM", label: "Average price (flats)"},
     m_chm:  {aspect: "hpi:monthlyChange", label: "Monthly change"},
     m_chy:  {aspect: "hpi:annualChange", label: "Yearly change"},
     m_vol:  {aspect: "hpi:salesVolume", label: "Sales volume"}
    }.each do |key, index|
      cols << index if param(key)
    end

    cols
  end

  def select_visible_results( all_results, columns )
    all_results.first( RESULTS_SAMPLE ).map do |result|
      columns.map {|col| formatted_value( result, col )}
    end
  end

  def formatted_value( result, col )
    v = result[col[:aspect]]
    if v && v.is_a?( Hash )
      v["@value"] || v
    else
      v
    end
  end
end
