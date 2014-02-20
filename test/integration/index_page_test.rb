
class IndexPageAcceptanceTest < AcceptanceSpec
  before do
    VCR.config do |c|
      c.allow_http_connections_when_no_cassette = true
    end
  end

  it "should have a place to search for locations" do
    visit "/"
    page.has_css?( "form[action='search'] input[name='search1']" ).must_equal true
    page.has_css?( "form[action='search'] button[type=submit]" ).must_equal true
  end

  it "will not (yet) have a place to make a comparison search" do
    visit "/"
    page.has_css?("#search input[name='search2']").must_equal false
  end

  it "will return a search result" do
    visit "/"
    fill_in( "search1", with: "coventry" )
    click_on( "action_search" )

    page.has_css?( "#search-results ul li a" )
  end
end
