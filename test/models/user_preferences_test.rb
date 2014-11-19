require 'test_helper'

describe "UserPreferences" do

  it "should define a partial for the area comparison" do
    # TODO needs updating
    # prefs = UserPreferences.new
    # prefs.area_comparison_partial.wont_be_nil
  end

  it "should report the selected location" do
    id0 = Struct::SearchID.new( nil, 0 )
    id1 = Struct::SearchID.new( nil, 1 )

    UserPreferences.new.selected_location_name(id0).must_be_nil
    UserPreferences.new({"loc_0" => ""}).selected_location_name(id0).must_be_nil
    UserPreferences.new({"loc_0" => "foo"}).selected_location_name(id0).must_equal "foo"
    UserPreferences.new({"loc_0" => "foo"}).selected_location_name(id1).must_be_nil
    UserPreferences.new({"loc_1" => "foo"}).selected_location_name(id0, true).must_equal "foo"
  end

  it "should report when an index is selected" do
    up = UserPreferences.new( {"m_hpi" => "1", "m_ap" => "true"} )
    up.selected_index?( :m_hpi ).must_equal true
    up.selected_index?( "m_hpi" ).must_equal true
    up.selected_index?( "m_hpi", "1" ).must_equal true
    up.selected_index?( "m_ap", "foo" ).must_equal false
    up.selected_index?( "m_vol" ).must_equal false
  end

  it "should report the selected indices" do
    up = UserPreferences.new( {"m_hpi" => "1"} )
    up.selected_indices.must_equal [{aspect: "hpi:indicesSASM", label: "Index"}]
  end

  it "should return a path corresponding to the current preferences" do
    Rails.application.routes.draw {resources :hpi}
    UserPreferences.new( {"m_hpi" => "1"} ).as_path( :hpi ).must_equal "/hpi?m_hpi=1"
    UserPreferences.new( {"m_hpi" => "1", "loc_0" => "hpi"} ).as_path( :hpi ).must_equal "/hpi?loc_0=hpi&m_hpi=1"
    UserPreferences.new( {"m_hpi" => "1", "blacklist" => "hpi"} ).as_path( :hpi ).must_equal "/hpi?m_hpi=1"
  end

  it "should report whether the user wants a comparison area" do
    UserPreferences.new( ).compare_areas?.must_equal false
    UserPreferences.new( "compare" => "1" ).compare_areas?.must_equal true
  end

  it "should allow the specification of additional path parameters" do
    UserPreferences.new( {"m_hpi" => "1"} ).as_path( :hpi, {opt: "opt"} ).must_equal "/hpi?m_hpi=1&opt=opt"
  end
end
