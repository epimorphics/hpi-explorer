# A model object to encapsulate the search preferences we have elicited from the user
#
# The following parameters are expected
# search_N - search term 1 or 2
# loc_N - name of selected search item 1 or 2
# loc_uri_N - URI of selected search item 1 or 2
# compare - true or false for area comparison query
# from_m, to_m - month part of date range
# from_y, to_y - year part of date range
# source - used to tag various user input forms
# m_* - measures in the cube
class UserPreferences
  Struct.new( "SearchID", :sym, :n )
  Struct.new( "SearchDisplayConfig", :partial, :locals )

  include Rails.application.routes.url_helpers

  INDEX_DEFINITIONS = {
    m_hpi:  {aspect: "hpi:indicesSASM", label: "Index"},
    m_ap:   {aspect: "hpi:averagePricesSASM", label: "Average price"},
    m_apd:  {aspect: "hpi:averagePricesSASM", label: "Average price (detached)"},
    m_apsd: {aspect: "hpi:averagePricesSASM", label: "Average price (semi-detached"},
    m_apt:  {aspect: "hpi:averagePricesSASM", label: "Average price (terraced)"},
    m_apf:  {aspect: "hpi:averagePricesSASM", label: "Average price (flats)"},
    m_chm:  {aspect: "hpi:monthlyChange", label: "Monthly change"},
    m_chy:  {aspect: "hpi:yearlyChange", label: "Yearly change"},
    m_vol:  {aspect: "hpi:salesVolume", label: "Sales volume"}
  }

  WHITE_LIST = (INDEX_DEFINITIONS.keys +
                %w(controller action
                   search_0 loc_0 loc_uri_0
                   search_1 loc_1 loc_uri_1
                   compare
                   from_m from_y to_m to_y
                   source
                   format
                   explain
                  )
               ).map( &:to_s )

  IGNORED_PARAMS = ["action", "controller","format"]

  attr_reader :params

  def initialize( params = {} )
    @params = indifferent_access( params )
    sanitise!
    prioritise!
  end

  # Return a search ID
  def search_id( n )
    Struct::SearchID.new( :"search_#{n}", n )
  end

  # Return the name selected for the given search option
  def selected_location_name( search_id, use_other = false )
    sid = use_other ? other_search_id( search_id ) : search_id
    param( :"loc_#{sid.n}" )
  end

  def describe_selected_location( framing=["Index data for", "Comparing"] )
    sn = (0..1).map {|i| selected_location_name( search_id( i ) )} .compact

    case sn.length
    when 1 then "#{framing[0]} #{sn[0]}"
    when 2 then "#{framing[1]} #{sn[0]} and #{sn[1]}"
    end
  end

  # Return the URI selected for the given search option
  def selected_location_uri( search_id, use_other = false )
    sid = use_other ? other_search_id( search_id ) : search_id
    param( :"loc_uri_#{sid.n}" )
  end

  # Return true if the location has been specified
  def selected_location?( search_id, use_other = false )
    !!selected_location_name( search_id, use_other )
  end

  # Return true if the given index is currently selected
  def selected_index?( index_name, val = nil )
    selected = !!(@params[index_name] && (!val || @params[index_name] == val))

    selected || default_value?( index_name )
  end

  # Return an array of the index definitions if that index is
  # currently selected
  def selected_indices
    INDEX_DEFINITIONS.select {|key, index| param(key)} .values
  end

  # Return the number of currently selected indices
  def num_selected_indices
    selected_indices.size
  end

  # Return true if the user has selected the option to compare two areas
  def compare_areas?
    @params.keys.include?( "compare" )
  end

  # Return the search term for the given id, or nil
  def search_term( search_id )
    param( search_id.sym )
  end

  # Return true if the user has entered a complete set of locations and we
  # can begin query
  def location_complete?
    sl = (0..1).map {|sid| selected_location?( search_id( sid ) )}

    compare_areas? ? (sl[0] && sl[1]) : sl[0]
  end

  # Return the necessary information to present the given search option
  def search_display_config( search_id )
    # no_locations? ? "hpi/no_results" : "hpi/search_results"
    st = search_term_sym( search_id )
    ct = compare_sym( search_id )
    ot = other_term_selected( search_id )

    key = :"#{st}_#{ct}_#{ot}"
    begin
      self.send( key, search_id )
    rescue
      binding.pry
    end
  end

  # Return the non-empty value of parameter p, or nil
  def param( p )
    ((pp = params[p].to_s) && pp.length > 0) ? pp : nil
  end

  # Return the current preferences as arguments to the given controller path
  def as_path( controller, options = {}, delete = [] )
    path_params = params.merge( options )

    delete.each do |key|
      path_params.delete( key.to_sym )
      path_params.delete( key.to_s )
    end

    path =
      case controller
      when :search
        search_index_path( path_params )
      when :view
        view_index_path( path_params )
      when :preview
        preview_index_path( path_params )
      when :hpi
        hpi_index_path( path_params )
      when :hpi_data
        hpi_data_path( path_params )
      when :print
        print_index_path( path_params )
      else
        raise "Do not know how to make path for #{controller}"
      end

    # this shouldn't be necessay if ENV[RAILS_RELATIVE_ROOT] was working correctly
    path.gsub( /^/, "#{ENV['RAILS_RELATIVE_URL_ROOT']}" )
  end

  # Return the given attribute, tagged with the given search id (e.g search_0)
  def attribute_with_search_id( attrib, search_id )
    :"#{attrib}_#{search_id.n}"
  end

  # Return the time period model
  def time_period
    @time_period ||= TimePeriod.new( self )
  end

  # Return true if the start date is later than the end date
  def negative_date_range?
    time_period.negative?
  end

  def empty?
    (params.keys - IGNORED_PARAMS).empty?
  end

  private

  def indifferent_access( h )
    h.is_a?( HashWithIndifferentAccess) ? h : HashWithIndifferentAccess.new( h )
  end

  # If the prefs are not explicitly set by the user via a form, and no explicit
  # selections have yet been made, some measures have a default value
  def default_value?( index_name )
    selected_indices.empty? &&
    !source?( :preview_form ) &&
    measures_on_by_default.include?( index_name )
  end

  def measures_on_by_default
    %w(m_hpi)
  end

  def source
    params[:source]
  end

  def source?( s )
    source == s
  end

  def whitelist_params
    WHITE_LIST
  end

  def whitelisted?( param )
    whitelist_params.include?( param.to_s )
  end

  # Remove any non-whitelisted parameters
  def sanitise!
    @params.keep_if {|k,v| whitelisted? k}
  end

  # There is a priority ordering among params. If there is a search term N, it is
  # more important than loc N and loc_uri N
  def prioritise!
    (0..1).each do |i|
      search_id = search_id( i )
      if (st = search_term( search_id )) && (st != selected_location_name( search_id ))
        %w(loc loc_uri).each do |dep_key|
          @params.delete( attribute_with_search_id( dep_key, search_id ) )
        end
      end
    end
  end

  # Returns :search or :no_search, depending on whether search term N is defined
  def search_term_sym( search_id )
    :"#{no( search_id.sym )}search"
  end

  # Returns :compare or :no_compare, depending on whether the compare option has been selected
  def compare_sym( search_id )
    :"#{no( :compare )}compare"
  end

  # Returns :other_term or :no_other_term, if :loc_uri_1 is specified if
  # this search id 0, and vice-versa
  def other_term_selected( search_id )
    :"#{no( other_id( search_id, "loc_uri" ))}other_term"
  end

  def no( x )
    params[x] ? "" : "no_"
  end

  def other_search_id( search_id )
    search_id( [1,0][search_id.n] )
  end

  def other_id( search_id, token )
    i = [1,0][search_id.n]
    :"#{token}_#{i}"
  end

  def no_search_no_compare_no_other_term( search_id )
    partial = ["hpi/area_selection", "hpi/add_second_area_selection"][search_id.n]
    Struct::SearchDisplayConfig.new( partial,
                                     {title: "Select an area",
                                      search_id: search_id} )
  end

  def no_search_compare_no_other_term( search_id )
    title = ["Select an area", "Select a second area"][search_id.n]
    Struct::SearchDisplayConfig.new( "hpi/area_selection",
                                     {title: title,
                                      search_id: search_id} )
  end

  def no_search_compare_other_term( search_id )
    other_name = param( other_id( search_id, :loc ) )
    title = ["Select an area", "Select a second area"][search_id.n]
    Struct::SearchDisplayConfig.new( "hpi/area_selection",
                                     {title: title,
                                      search_id: search_id} )
  end

  def search_no_compare_no_other_term( search_id )
    no_search_no_compare_no_other_term( search_id )
  end

  def search_compare_no_other_term( search_id )
    no_search_compare_no_other_term( search_id )
  end

  def search_compare_other_term( search_id )
    no_search_compare_other_term( search_id )
  end

  def no_search_no_compare_other_term( search_id )
    no_search_no_compare_no_other_term( search_id )
  end

end
