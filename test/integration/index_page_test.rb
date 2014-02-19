
class IndexPageAcceptanceTest < AcceptanceSpec

  it "should have a place to search for locations" do
    visit "/"
    page.has_css?( "form[action='search'] input[name='search1']" ).must_equal true
    page.has_css?( "form[action='search'] button[type=submit]" ).must_equal true
  end

  it "will not (yet) have a place to make a comparison search" do
    visit "/"
    page.has_css?("#search input[name='search2']").must_equal false
  end

  # it "will have controls to select indicators" do
  #   visit "/"
  #   %w(m_hpi m_ap m_chm m_chm m_vol).each do |measure|
  #     page.has_css?( "input[type='checkbox'][name='#{measure}']" ).must_be_same_as true
  #   end
  # end

  # it "will only have the hpi selected by default" do
  #   visit "/"
  #   %w(m_hpi m_ap m_chm m_chm m_vol).each do |measure|
  #     page.has_checked_field?(measure).must_be_same_as (measure == "m_hpi")
  #   end
  # end
end
