# A model object to encapsulate the search preferences we have elicited from the user
class UserPreferences
  attr_reader :params

  def initialize( params )
    @params = params
  end

  def area_comparison_partial
    "hpi/add_second_area_selection"
  end

  def selected_location_name
    param( :loc )
  end

  def selected_index?( index_name, val = nil )
    @params[index_name] && (!val || @params[index_name] == val)
  end

  def param( p )
    pp = params[p]
    (pp && pp.length > 0) ? pp : nil
  end

end
