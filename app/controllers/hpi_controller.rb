class HpiController < ApplicationController
  def index
    if preferences.selected_location?
      @query_command = QueryCommand.new( preferences )
      @query_command.load_query_results()
    end
  end
end
