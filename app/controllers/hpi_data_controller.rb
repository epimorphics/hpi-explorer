class HpiDataController < ApplicationController
  def show
    if is_explanation?
      explanation = ExplainCommand.new( preferences).load_explanation
      redirect_to qonsole_rails.root_path( query: explanation[:sparql] )
    else
      @query_command = QueryCommand.new( preferences )

      if @query_command.empty_preferences?
        Rails.logger.info "No data params, redirecting back to index page"
        redirect_to controller: :hpi, action: :index
      else
        @query_command.load_query_results( limit: :all, download: true )

        if request.format == Mime::Type.lookup_by_extension( :ttl )
          @turtle_resources = @query_command.turtle_resources
        end
      end
    end
  end

  def is_explanation?
    params[:explain]
  end
end
