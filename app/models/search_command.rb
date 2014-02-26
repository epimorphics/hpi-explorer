class SearchCommand < DataService
  DEFAULT_SEARCH_TERM = "England and Wales"

  attr_reader :search_term, :locations, :query

  def initialize( preferences )
    super( preferences )
    @search_term = identify_search_term( preferences )
    @query = create_search_query( @search_term ) if @search_term
  end

  def find_unique_locations
    results = @query ? dataset( :hpi ).query( @query ) : []
    @locations = unique_locations( results )
  end

  def unique_location?
    @locations.size == 1
  end

  def no_locations?
    @locations.size == 0
  end

  alias :search_term? :search_term

  def search_results_partial
    if search_term?
      no_locations? ? "hpi/no_results" : "hpi/search_results"
    else
      "hpi/no_search"
    end
  end


  private


  def identify_search_term( preferences )
    preferences.param( :search1 ) || preferences.param( :search2 ) || DEFAULT_SEARCH_TERM
  end

  def create_search_query( term )
    base_query.search( term.split.map {|t| "+#{t}*"} .join( ' ' ) )
  end

  def unique_locations( results )
    results.inject( Set.new ) do |memo, result|
      memo << {"@id" => result["hpi:refRegion"]["@value"], "label" => result["hpi:refRegionName"]["@value"]}
    end .to_a
  end

end
