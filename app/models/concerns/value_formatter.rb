module ValueFormatter
  include ActionView::Helpers::NumberHelper

  FORMATTERS = {
    "hpi:averagePricesSASM"               => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesDetachedSASM"       => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesSemiDetachedSASM"   => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesTerracedSASM"       => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesFlatMaisonetteSASM" => ->(c, v){c.format_currency_r v},
    "hpi:refPeriod"                       => ->(c, v){c.format_month_year v}
  }

  def format_value( results, i, col )
    v = raw_value( results, i, col )
    if f = FORMATTERS[aspect_of col]
      v = f.call( self, v )
    end
    v
  end

  def align_right( v )
    "<span class='text-right'>#{v}</span>"
  end

  def format_currency_r( val, currency = nil )
    align_right( format_currency( val, currency ) ).html_safe
  end

  def format_currency( val, currency = nil )
    number_to_currency( val.to_i, locale: "en-gb", unit: currency || pound, precision: 0 )
  end

  def format_month_year( val )
    year, month = val.split( "-" ).map( &:to_i )
    date = Date.new( year, month, 1 )
    date.strftime( "%B %Y")
  end

  def raw_value( results, i, col )
    result = results[query_id_of col][i]
    v = result[aspect_of col]

    if v && v.is_a?( Hash )
      v["@value"] || v
    else
      v
    end
  end

  def aspect_of( col )
    col[:aspect]
  end

  def query_id_of( col )
    col[:query_id]
  end

  def pound
    "&pound;".html_safe
  end

end
