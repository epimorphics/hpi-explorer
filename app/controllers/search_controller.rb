class SearchController < ApplicationController
  DEFAULT_SEARCH_TERM = "England and Wales"

  DEFAULT_PREVIEW_OPTIONS = {m_hpi: true}

  def create
    @preferences = UserPreferences.new( params )

    @search_cmd = SearchCommand.new( params )
    @search_cmd.find_unique_locations
  end
end
