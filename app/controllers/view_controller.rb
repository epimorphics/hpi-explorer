# The ViewController handles the user action of viewing the data in full, in
# both table presentation and graph presentation
class ViewController < ApplicationController
  def index
    @query_command = QueryCommand.new( preferences )

    if @query_command.empty_preferences?
      Rails.logger.info "No view params, redirecting back to index page"
      redirect_to controller: :hpi, action: :index
    else
      @query_command.load_query_results( limit: :all )
    end
  end
end
