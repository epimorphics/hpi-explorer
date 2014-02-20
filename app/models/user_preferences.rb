# A model object to encapsulate the search preferences we have elicited from the user
class UserPreferences
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

  attr_reader :params

  def initialize( params = {} )
    @params = indifferent_access( params )
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

  # Return true if the given index is currently selected
  def selected_index?( index_name, val = nil )
    !!(@params[index_name] && (!val || @params[index_name] == val))
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

  private

  def indifferent_access( h )
    h.is_a?( HashWithIndifferentAccess) ? h : HashWithIndifferentAccess.new( h )
  end

end
