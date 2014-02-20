class PreviewController < ApplicationController
  def index
    @preferences = UserPreferences.new( params )
    @query_command = QueryCommand.new( @preferences )
    @query_command.load_query_results()
  end

  def create
    index
    render action: :index
  end
end
