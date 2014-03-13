class DownloadController < ApplicationController
  def index
    @query_command = QueryCommand.new( preferences )
    @query_command.load_query_results( limit: :all, download: true )
  end
end
