class QueryCommand

  attr_reader :params, :results

  def initialize( params )
    @params = params
  end

  def load_query_results( preferences )
    @results = [:foo]
  end

end
