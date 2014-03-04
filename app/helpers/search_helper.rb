module SearchHelper
  def present_search_result( search_command, location )
    preferences = search_command.preferences
    can_preview = search_command.location_complete?

    options = {search_command.attribute_with_search_id( "loc" ) => location["label"],
               search_command.attribute_with_search_id( "loc_uri" ) => location["@id"]
              }

    options.merge!( SearchController.default_preview_options ) if can_preview

    link_to( search_command.link_title( location["label"] ),
             preferences.as_path( search_command.controller, options, [search_command.attribute_with_search_id( :search )] )
           )
  end

  def render_selected_search_term( search_id, preferences )
    if preferences.selected_location?( search_id )
      render( partial: "hpi/selected_search_term",
              locals: {search_id: search_id,
                       preferences: preferences} )
    end
  end

end
