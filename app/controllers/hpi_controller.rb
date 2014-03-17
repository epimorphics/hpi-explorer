class HpiController < ApplicationController
  def index
    set_search_configuration
    if preferences.location_complete?
      Rails.logger.debug "Running query from HPI because location OK"
      @query_command = QueryCommand.new( preferences )
      @query_command.load_query_results()
    else
      Rails.logger.debug "Not running query from HPI because location imcomplete"
    end
  end
end
