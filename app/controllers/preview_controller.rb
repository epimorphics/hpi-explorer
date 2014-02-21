class PreviewController < ApplicationController
  def create
    @preferences = UserPreferences.new( params )
    @query_command = QueryCommand.new( @preferences )
    @query_command.load_query_results()

    if request.xhr?
      preview_header = render_to_string( partial: "hpi/selected_location", layout: false )
      results_preview = render_to_string( partial: "preview", layout: false )
      render json: {header: preview_header, preview: results_preview}
    end
  end
end
