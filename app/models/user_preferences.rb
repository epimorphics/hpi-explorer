# A model object to encapsulate the search preferences we have elicited from the user
class UserPreferences

  def initialize( params )
    attributes = Hash.new {|h,k| h[k] = []}
    @attributes = parse_attributes( params, attributes )
  end

  def locations
    @attributes[:locations]
  end

  def area_comparison_partial
    "hpi/add_second_area_selection"
  end


  private

  def parse_attributes( params, attributes )
    parse_locations( params, attributes )
    attributes
  end

  def parse_locations( params, attributes )
    {"country1" => "hpi:refCountryName"}.each do |key1,key2|
      attributes[:locations] << {key2 => params[key1]}
    end
  end
end
