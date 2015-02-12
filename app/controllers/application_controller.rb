class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def preferences
    @preferences ||= UserPreferences.new( params )
  end

  def time_period
    preferences.time_period
  end

  def set_search_configuration
    time_period

    @search_id_0 = preferences.search_id( 0 )
    @search_id_1 = preferences.search_id( 1 )

    @search_display_config_0 = preferences.search_display_config( @search_id_0 )
    @search_display_config_1 = preferences.search_display_config( @search_id_1 )
  end

  unless Rails.application.config.consider_all_requests_local
    rescue_from ActionController::RoutingError, :with => :render_404
    rescue_from Exception, with: :render_exception
  end

  def render_exception( e )
    if e.instance_of? ArgumentError
      render_error( 400 )
    elsif e.instance_of? ActionController::InvalidAuthenticityToken
      Rails.logger.warn "Invalid authenticity token #{e}"
      render_error( 403 )
    else
      Rails.logger.warn "No explicit error page for exception #{e} - #{e.class.name}"
      render_error( 500 )
    end
  end

  def render_404( e = nil )
    render_error( 404 )
  end

  def render_error( status )
    respond_to do |format|
      format.html { render( layout: false,
                            file: Rails.root.join( 'public', 'landing', status.to_s ),
                            status: status ) }
      format.all { render nothing: true, status: status }
    end
  end

end
