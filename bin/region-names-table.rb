require 'set'
require 'json'

sresults = JSON.parse( IO.read( 'results.json' ) )
locations = Hash.new

sresults["results"]["bindings"].each do |result|
  v = result["value"]["value"]
  l = result["label"]
  p = result["parent"]
  c = result["child"]
  s = result["same"]

  if l["xml:lang"] == "en"
    unless locations[v]
      locations[v] = {children: Set.new}
    end

    location = locations[v]
    location[:label] = l["value"]
    location[:parent] = p["value"] if p
    location[:children] << c["value"] if c

    if s && s["value"] =~ /(E\d+)$/
      location[:gss] = $1
    end
  end
end

location_names = []
gss_index = Hash.new

locations.each do |uri, properties|
  location_names << {value: uri, label: properties[:label]}
  properties[:children] = properties[:children].to_a
  gss_index[properties[:gss]] = uri if properties[:gss]
end

location_names.sort! {|s0,s1| s0[:label] <=> s1[:label]}

puts "var HpiLocations = function() {"
puts "var locationNames = #{location_names.to_json};"
puts "var locations = #{locations.to_json};"
puts "var gssIndex = #{gss_index.to_json};"
puts "return {locationNames: locationNames, locations: locations, gssIndex: gssIndex};"
puts "}();"
