module HpiHelper
  def list_related_locations( preferences )
    output = []

    (0..1).each do |i|
      output << _list_related_locations( preferences.search_id( i ), preferences )
    end

    output.join( "<br />" ).html_safe
  end

  def _list_related_locations( search_id, preferences )
    if uri = preferences.selected_location_uri( search_id )
      lc = Location.new( uri )

      within = render_place_link( lc.within, preferences, search_id ) if lc.within
      contains = lc.contains
                   .sort {|place0, place1| place0["label"] <=> place1["label"]}
                   .map {|place| render_place_link( place, preferences, search_id )}
      name = preferences.selected_location_name( search_id )

      if within && contains.length > 0
        str = "#{name} is part of #{within}, and contains: #{contains.join( ", " )}"
      elsif within
        str = "#{name} is part of #{within}"
      elsif contains.length > 0
        str = "#{name} contains: #{contains.join( ", " )}"
      else
        str = nil
      end

      str.html_safe if str
    end
  end

  def render_place_link( place, preferences, search_id )
    loc = preferences.attribute_with_search_id( "loc", search_id )
    loc_uri = preferences.attribute_with_search_id( "loc_uri", search_id )
    name = (place["label"]).kind_of?(Hash) ? place["label"]["@value"] : place["label"]

    link_to( name, preferences.as_path( :hpi, {loc => name, loc_uri => place["@id"]} ))
  end

end
