class DownloadController < ApplicationController
  def index
    @query_command = QueryCommand.new( preferences )
    @query_command.load_query_results( limit: :all, download: true )

    if request.format == Mime::Type.lookup_by_extension( :ttl )
      @turtle_resources = @query_command.turtle_resources
    end
  end
end
