#
class SearchCommand < DataService
  DEFAULT_SEARCH_TERM = "England and Wales"

  attr_reader :search_term, :locations, :query, :search_id, :controller

  def initialize( preferences, search_id )
    super( preferences )
    @search_id = search_id
    @search_term = identify_search_term( preferences, search_id )
    @query = create_search_query( @search_term ) if @search_term
  end

  def find_unique_locations
    Rails.logger.info "About to ask search query |||#{@query && @query.to_json}|||"
    results = @query ? dataset( :hpi ).query( @query ) : []
    @locations = unique_locations( results )
  end

  def single_location?
    @locations.size == 1
  end

  def no_locations?
    @locations.size == 0
  end

  def locations?
    !no_locations?
  end

  alias :search_term? :search_term

  # Only allow the user to progress to previewing results once all locations are specified
  def controller
    preferences.location_complete? ? :preview : :search
  end

  def location_complete?
    preferences.location_complete?
  end

  def attribute_with_search_id( attrib )
    preferences.attribute_with_search_id( attrib, search_id )
  end

  private


  def identify_search_term( preferences, search_id )
    preferences.search_term( search_id )
  end

  def create_search_query( term )
    lucene_pattern = "( #{term.split.map {|t| "+#{t}*"} .join( ' ' )} )"
    base_query.search_property( "hpi:refRegionName", lucene_pattern )
  end

  def unique_locations( results )
    results.inject( Set.new ) do |memo, result|
      uri = result["hpi:refRegion"]["@id"]
      labels = result["hpi:refRegionName"]
      label = labels.kind_of?( Array ) ? labels.first : labels
      memo << {"@id" => uri, "label" => label}
    end .to_a
        .sort {|a,b| a["label"] <=> b["label"]}
  end

end
