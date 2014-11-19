
class IndexPageAcceptanceTest < AcceptanceSpec
  before do
    VCR.configure do |c|
      c.allow_http_connections_when_no_cassette = true
    end
  end

  it "should have a place to search for locations" do
    visit root_path
    page.has_css?( "form[action='/search'] input[name='search_0']" ).must_equal true
    page.has_selector?( "button#action_search", visible: false ).must_equal true
  end

  it "will not (yet) have a place to make a comparison search" do
    visit root_path
    page.has_no_selector?("form[action='/search'] input[name='search_1']", visible: false ).must_equal true
  end

  it "will return a search result" do
    visit root_path
    fill_in( "search_0", with: "coventry\n" )

    page.has_css?( "#search-results ul li a" )
  end
end
