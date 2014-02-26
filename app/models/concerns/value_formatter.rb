module ValueFormatter
  include ActionView::Helpers::NumberHelper

  FORMATTERS = {
    "hpi:averagePricesSASM"               => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesDetachedSASM"       => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesSemiDetachedSASM"   => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesTerracedSASM"       => ->(c, v){c.format_currency_r v},
    "hpi:averagePricesFlatMaisonetteSASM" => ->(c, v){c.format_currency_r v}
  }

  def format_value( result, col )
    v = raw_value( result, col )
    if f = FORMATTERS[aspect_of col]
      v = f.call( self, v )
    end
    v
  end

  def align_right( v )
    "<span class='text-right'>#{v}</span>"
  end

  def format_currency_r( val, currency = "£" )
    align_right( format_currency( val, currency ) ).html_safe
  end

  def format_currency( val, currency = "£" )
    number_to_currency( val.to_i, locale: "en-gb", unit: currency, precision: 0 )
  end

  def raw_value( result, col )
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

end
