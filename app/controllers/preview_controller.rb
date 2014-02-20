class PreviewController < ApplicationController
  def index
    @preferences = UserPreferences.new( params )
  end

  def create
    index
    render action: :index
  end
end
