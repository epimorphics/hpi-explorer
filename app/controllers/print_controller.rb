# The print controller creates a simplified view of the data
# suitable for printing
class PrintController < ApplicationController
  layout false

  def index
    @query_command = QueryCommand.new( preferences )
    @query_command.load_query_results( limit: :all )
  end
end
