class SearchController < ApplicationController
  DEFAULT_PREVIEW_OPTIONS = {m_hpi: true}

  def create
    @search_cmd = SearchCommand.new( preferences )
    @search_cmd.find_unique_locations
  end

  def self.default_preview_options
    year = Time.now.year
    month = Time.now.month

    DEFAULT_PREVIEW_OPTIONS.merge( {
      from_y: (year - 1).to_s,
      from_m: month.to_s,
      to_y: year.to_s,
      to_m:  month.to_s
    })
  end
end
