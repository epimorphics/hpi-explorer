class HpiController < ApplicationController
  def index
    @preferences = UserPreferences.new( params )
  end
end
