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
end
