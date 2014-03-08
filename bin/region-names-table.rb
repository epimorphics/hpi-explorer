require 'set'
require 'json'

sresults = JSON.parse( IO.read( 'results.json' ) )
locations = Hash.new

sresults["results"]["bindings"].each do |result|
  v = result["value"]["value"]
  l = result["label"]
  p = result["parent"]
  c = result["child"]

  if l["xml:lang"] == "en"
    unless locations[v]
      locations[v] = {children: Set.new}
    end

    locations[v][:label] = l["value"]
    locations[v][:parent] = p["value"] if p
    locations[v][:children] << c["value"] if c
  end
end

location_names = []

locations.each do |uri, properties|
  location_names << {value: uri, label: properties[:label]}
  properties[:children] = properties[:children].to_a
end

location_names.sort! {|s0,s1| s0[:label] <=> s1[:label]}

puts "var HpiLocations = function() {"
puts "var locationNames = #{location_names.to_json}"
puts "var locations = #{locations.to_json}"
puts "return {locationNames: locationNames, locations: locations};"
puts "}();"
