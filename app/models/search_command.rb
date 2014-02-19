class SearchCommand
  DEFAULT_SEARCH_TERM = "England and Wales"

  attr_reader :search_term, :locations, :query

  def initialize( params )
    @search_term = identify_search_term( params )
    @query = create_search_query( @search_term )
  end

  def find_unique_locations
    results = hpi_dataset.query( @query )
    @locations = unique_locations( results )
  end

  def unique_location?
    @locations.size == 1
  end

  def no_locations?
    @locations.size == 0
  end

  def identify_search_term( params )
    params[:search1] || params[:search2] || DEFAULT_SEARCH_TERM
  end

  def create_search_query( term )
    DataServicesApi::QueryGenerator
              .new
              .equals( "hpi:refRegionName", term )
  end

  def data_service
    # TODO move endpoint location to config file
    @data_service ||= DataServicesApi::Service.new
  end

  def hpi_dataset
    @hpi_dataset ||= data_service.dataset( "hpi" )
  end

  def unique_locations( results )
    results.inject( Set.new ) do |memo, result|
      memo << {"@id" => "na", "label" => result["hpi:refRegionName"]["@value"]}
    end .to_a
  end

end
