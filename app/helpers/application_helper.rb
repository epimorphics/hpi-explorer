module ApplicationHelper
  def preferences
    @preferences
  end

  def location_name
    preferences.selected_location_name
  end

end
