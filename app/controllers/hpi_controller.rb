class HpiController < ApplicationController
  def index
    @preferences = UserPreferences.new( params )

    @search_cmd = SearchCommand.new( params )
    @search_cmd.find_unique_locations
  end

  def create
  end
end
