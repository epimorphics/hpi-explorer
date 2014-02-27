# The ViewController handles the user action of viewing the data in full, in
# both table presentation and graph presentation
class ViewController < ApplicationController
  def index
    @query_command = QueryCommand.new( preferences )
    @query_command.load_query_results( limit: :all )
  end
end
