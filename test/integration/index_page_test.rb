
class IndexAcceptanceTest < AcceptanceSpec

  it "should have input controls to search by place" do
    visit "/"
    page.has_css?( "select[name='country1']" ).must_be_same_as true

    %w(region1 county_or_ua1 borough1).each do |place|
      page.has_css?( "input[type='text'][name='#{place}']" ).must_be_same_as true
    end
  end

  it "will not (yet) have a place to make a comparison search" do
    visit "/"
    page.has_css?("select[name='country2']").must_be_same_as false
  end

  it "will have controls to select indicators" do
    visit "/"
    %w(m_hpi m_ap m_chm m_chm m_vol).each do |measure|
      page.has_css?( "input[type='checkbox'][name='#{measure}']" ).must_be_same_as true
    end
  end

  it "will only have the hpi selected by default" do
    visit "/"
    %w(m_hpi m_ap m_chm m_chm m_vol).each do |measure|
      page.has_checked_field?(measure).must_be_same_as (measure == "m_hpi")
    end
  end
end
