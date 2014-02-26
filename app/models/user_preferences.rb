# A model object to encapsulate the search preferences we have elicited from the user
class UserPreferences
  include Rails.application.routes.url_helpers

  INDEX_DEFINITIONS = {
    m_hpi:  {aspect: "hpi:indicesSASM", label: "Index"},
    m_ap:   {aspect: "hpi:averagePricesSASM", label: "Average price"},
    m_avd:  {aspect: "hpi:averagePricesSASM", label: "Average price (detached)"},
    m_avsd: {aspect: "hpi:averagePricesSASM", label: "Average price (semi-detached"},
    m_avt:  {aspect: "hpi:averagePricesSASM", label: "Average price (terraced)"},
    m_avf:  {aspect: "hpi:averagePricesSASM", label: "Average price (flats)"},
    m_chm:  {aspect: "hpi:monthlyChange", label: "Monthly change"},
    m_chy:  {aspect: "hpi:yearlyChange", label: "Yearly change"},
    m_vol:  {aspect: "hpi:salesVolume", label: "Sales volume"}
  }

  WHITE_LIST = (INDEX_DEFINITIONS.keys +
                %w(loc loc_uri controller action search1 search2
                   from_m from_y to_m to_y
                   user_form
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
    "hpi/add_second_area_selection"
  end

  # Return the name of the currently selected location
  def selected_location_name
    param( :loc )
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
  def as_path( controller, action = :index )
    url_for( params.merge( {controller: controller, action: action, only_path: true} ) )
  end

  private

  def indifferent_access( h )
    h.is_a?( HashWithIndifferentAccess) ? h : HashWithIndifferentAccess.new( h )
  end

  # If the prefs are not explicitly set by the user via a form,
  # some measures have a default value
  def default_value?( index_name )
    measures_on_by_default.include?( index_name ) && !input_provided_by_user
  end

  def measures_on_by_default
    %w(m_hpi)
  end

  def input_provided_by_user
    params[:user_form]
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
