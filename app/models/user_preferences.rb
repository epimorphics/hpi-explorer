# A model object to encapsulate the search preferences we have elicited from the user
class UserPreferences
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
                %w(loc loc_uri controller action search1 search2
                   from_m from_y to_m to_y
                   source
                   compare
                  )
               ).map( &:to_s )

  attr_reader :params

  def initialize( params = {} )
    @params = indifferent_access( params )
    sanitise!
  end

  # Return the name of the partial to use to layout a second search area
  # for comparisons
  def area_comparison_partial
    compare_areas? ? "hpi/second_area_selection": "hpi/add_second_area_selection"
  end

  # Return the name of the currently selected location
  def selected_location_name
    param( :loc )
  end

  def selected_location_uri
    param( :loc_uri )
  end

  # Return true if the location has been specified
  def selected_location?
    !!selected_location_name
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

  # Return the non-empty value of parameter p, or nil
  def param( p )
    ((pp = params[p].to_s) && pp.length > 0) ? pp : nil
  end

  # Return the current preferences as arguments to the given controller path
  def as_path( controller, options = {} )
    path_params = params.merge( options )

    path =
      case controller
      when :view
        view_index_path( path_params )
      when :preview
        preview_index_path( path_params )
      when :hpi
        hpi_index_path( path_params )
      else
        raise "Do not know how to make path for #{controller}"
      end

    # this shouldn't be necessay if ENV[RAILS_RELATIVE_ROOT] was working correctly
    path.gsub( /^/, "#{ENV['RAILS_RELATIVE_URL_ROOT']}" )
  end

  # Return true if the user has selected the option to compare two areas
  def compare_areas?
    @params.keys.include?( "compare" )
  end

  private

  def indifferent_access( h )
    h.is_a?( HashWithIndifferentAccess) ? h : HashWithIndifferentAccess.new( h )
  end

  # If the prefs are not explicitly set by the user via a form,
  # some measures have a default value
  def default_value?( index_name )
    measures_on_by_default.include?( index_name ) && !source?( :preview_form )
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

  def sanitise!
    @params.keep_if {|k,v| whitelisted? k}
  end

end
