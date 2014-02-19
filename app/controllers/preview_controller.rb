class PreviewController < ApplicationController
  def create
    @preferences = UserPreferences.new( params )

    @search_cmd = SearchCommand.new( params )
    @search_cmd.find_unique_locations
  end
end
