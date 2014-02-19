class SearchController < ApplicationController
  DEFAULT_SEARCH_TERM = "England and Wales"

  def create
    @search_cmd = SearchCommand.new( params )
    @search_cmd.find_unique_locations
  end
end
