require 'json'

sresults = JSON.parse( IO.read( 'results.json' ) )

puts 'var regionNames = ['
sresults["results"]["bindings"].each do |result|
  v = result["value"]["value"]
  l = result["label"]

  if l["xml:lang"] == "en"
    puts "  {'value': '#{v}', 'label': '#{l['value']}'},"
  end
end

puts ']'
