require 'test_helper'
describe "UserPreferences" do
  it "should set the refCountryName selector" do
    user_prefs = UserPreferences.new( "country1" => "England and Wales" )

    user_prefs.locations.must_equal [{"hpi:refCountryName" => "England and Wales"}]
  end
end
