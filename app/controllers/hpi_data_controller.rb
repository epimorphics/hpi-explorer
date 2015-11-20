class HpiDataController < ApplicationController
  def show
    if is_explanation?
      explanation = ExplainCommand.new( preferences).load_explanation
      redirect_to sparql_qonsole_path( explanation[:sparql] )
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

  :private

  # Rails seems to have a problem automatically inserting the relative_url_path
  # twice. So we do it manually here.
  def sparql_qonsole_path( query )
    request.protocol + request.host_with_port +
    "#{Rails.application.config.relative_url_root}#{qonsole_rails.root_path( query: query )}"
  end
end
