class HpiController < ApplicationController
  def index
    set_search_configuration
    if preferences.location_complete?
      @query_command = QueryCommand.new( preferences )
      @query_command.load_query_results()
    end
  end
end
