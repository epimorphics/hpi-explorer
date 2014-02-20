require 'test_helper'
describe "UserPreferences" do

  it "should define a partial for the area comparison" do
    prefs = UserPreferences.new
    prefs.area_comparison_partial.wont_be_nil
  end

  it "should report the selected location" do
    UserPreferences.new.selected_location_name.must_be_nil
    UserPreferences.new({"loc" => ""}).selected_location_name.must_be_nil
    UserPreferences.new({"loc" => "foo"}).selected_location_name.must_equal "foo"
  end

  it "should report when an index is selected" do
    up = UserPreferences.new( {"m_hpi" => "1", "m_ap" => "true"} )
    up.selected_index?( :m_hpi ).must_equal true
    up.selected_index?( "m_hpi" ).must_equal true
    up.selected_index?( "m_hpi", "1" ).must_equal true
    up.selected_index?( "m_hpi", "2" ).must_equal false
    up.selected_index?( "m_vol" ).must_equal false
  end

  it "should report the selected indices" do
    up = UserPreferences.new( {"m_hpi" => "1"} )
    up.selected_indices.must_equal [{aspect: "hpi:indicesSASM", label: "Index"}]
  end
end
