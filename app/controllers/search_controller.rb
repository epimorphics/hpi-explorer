class SearchController < ApplicationController
  DEFAULT_PREVIEW_OPTIONS = {m_hpi: true}

  def create
    set_search_configuration
    @search_commands = Hash.new

    (0..1).each do |i|
      search_id = preferences.search_id( i )

      search_cmd = SearchCommand.new( preferences, search_id )
      search_cmd.find_unique_locations

      @search_commands[search_id.sym] = search_cmd
    end
  end

  def index
    create
    render action: :create
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
