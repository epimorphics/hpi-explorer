module PreviewHelper

  def render_hidden_fields( preferences )
    fields = []

    %w(loc loc_uri search).each do |param|
      (0..1).each do |i|
        search_id = preferences.search_id( i )

        tag = preferences.attribute_with_search_id( param, search_id )
        tag_value = preferences.param( tag )

        fields << hidden_field_tag( tag, tag_value ) if tag_value
      end
    end

    fields << hidden_field_tag( :compare, 1 ) if preferences.compare_areas?
    fields << hidden_field_tag( :source, :preview_form )

    fields.join( "\n" ).html_safe
  end

  # Draw the table header for the indices table. Will require two rows in the
  # case of a comparison table
  def indices_table_header( query_command )
    preferences = query_command.preferences
    elems = []

    if preferences.compare_areas?
      colspan = query_command.data_columns_count
      label_0 = preferences.selected_location_name( preferences.search_id( 0 ) )
      label_1 = preferences.selected_location_name( preferences.search_id( 1 ) )

      elems << content_tag( :tr ) do
          content_tag( :th ) +
          content_tag( :th, label_0, colspan: colspan, class: "text-center" ) +
          content_tag( :th, label_1, colspan: colspan, class: "text-center" )
        end
    end

    # column headings
    elems << content_tag( :tr ) do
      query_command.columns.each_with_index do |col, i|
        concat(
          content_tag( :th, class: (i > 0) ? "text-right" : "text-center",
                       "data-location" => col[:location],
                       "data-type" => col[:sType],
                       "data-aspect" => col[:aspect]
                     ) do
            col[:label]
          end
        )
      end
    end

    elems.join("\n").html_safe
  end
end
