module SearchHelper
  def present_search_result( search_command, location )
    preferences = search_command.preferences
    can_preview = search_command.location_complete?

    options = {search_command.attribute_with_search_id( "loc" ) => location["label"],
               search_command.attribute_with_search_id( "loc_uri" ) => location["@id"]
              }

    options.merge!( SearchController.default_preview_options ) if can_preview

    link_to( location["label"],
             preferences.as_path( search_command.controller, options, [search_command.attribute_with_search_id( :search )] )
           )
  end

  def unselect_location_button( preferences, search_id )
    loc_attrib = preferences.attribute_with_search_id( "loc", search_id )
    loc_uri_attrib = preferences.attribute_with_search_id( "loc_uri", search_id )
    path = preferences.as_path( :search, {}, [loc_attrib, loc_uri_attrib])

    link_to( "<i class='fa fa-times-circle'></i>".html_safe,
             path,
             {class: "btn btn-sm action action-remove-location", alt: "Remove this location", title: "Remove"}
           )
  end
end
