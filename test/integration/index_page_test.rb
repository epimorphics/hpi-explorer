
class IndexAcceptanceTest < AcceptanceSpec

  it "should have a place to search by county" do
    visit "/"
    find( "input[name='region1']" ).wont_be_nil
  end

end
