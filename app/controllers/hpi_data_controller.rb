class HpiDataController < ApplicationController
  def show
    if is_explanation?
      explanation = ExplainCommand.new( preferences).load_explanation
      qonsole_path = sparql_qonsole_path( explanation[:sparql] )
      redirect_to qonsole_path
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

  private

  def sparql_qonsole_path( query )
    path = qonsole_rails.root_path( q: query )

    # guard against various rails relative_url_root bugs
    # The relative_url_root should appear exactly once if given
    if rur = Rails.application.config.relative_url_root
      path = path.gsub( /\A(#{rur})*\/?/, rur + "/" )
    end

    path
  end
end
