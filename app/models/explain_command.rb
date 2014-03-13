class ExplainCommand < QueryCommand
  attr_reader :explanation

  def initialize( preferences )
    super
  end

  def load_explanation( options = {} )
    hpi = dataset( :hpi )

    non_loc_query = add_sort(
                      add_date_range_constraint(
                        base_query ) )

    query_0 = add_location_constraint( non_loc_query, search_id_0 )

    Rails.logger.debug "About to ask DsAPI to explain: #{query_0.to_json}"

    @explanation = hpi.explain( query_0 ).with_indifferent_access
  end

end
