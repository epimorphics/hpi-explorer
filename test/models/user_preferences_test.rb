require 'test_helper'
describe "UserPreferences" do
  it "should set the refCountryName selector and generate a query" do
    user_prefs = UserPreferences.new( "country1" => "England and Wales" )

    user_prefs.locations.must_equal [{"hpi:refCountryName" => "England and Wales"}]

    user_prefs.query.must_not_be_nil
    user_prefs.query.to_json.must_match_json_expression {"hpi:refRegion"}

  end
end
