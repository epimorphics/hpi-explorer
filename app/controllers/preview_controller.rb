class PreviewController < ApplicationController
  def index
    @preferences = UserPreferences.new( params )
    @query_command = QueryCommand.new( params )
    @query_command.load_query_results( @preferences )
  end

  def create
    index
    render action: :index
  end
end
