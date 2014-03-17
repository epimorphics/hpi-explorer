class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def preferences
    @preferences ||= UserPreferences.new( params )
  end

  def time_period
    @time_period ||= TimePeriod.new( preferences )
  end

  def set_search_configuration
    time_period

    @search_id_0 = preferences.search_id( 0 )
    @search_id_1 = preferences.search_id( 1 )

    @search_display_config_0 = preferences.search_display_config( @search_id_0 )
    @search_display_config_1 = preferences.search_display_config( @search_id_1 )
  end
end
