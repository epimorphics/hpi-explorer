describe "DataService" do
  before do
    VCR.insert_cassette name, :record => :new_episodes
  end

  after do
    VCR.eject_cassette
  end


  it "should provide a data service object on request" do
    ds = DataService.new( nil ).data_service
    ds.wont_be_nil
    ds.must_respond_to :dataset
  end

  it "should create a dataset accessor on request" do
    ds = DataService.new( nil ).data_service
    hpi = ds.dataset( :hpi )
    hpi.wont_be_nil
    hpi.must_respond_to :query
  end

  it "should create a base query on request" do
    DataService.new( nil ).base_query.wont_be_nil
    DataService.new( nil ).base_query.must_respond_to :eq
  end


end
