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
    location[:uri] = v
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
puts <<END
var regionNameIndex = {
  "Wales Euro Region":                      "http://landregistry.data.gov.uk/id/region/wales",
  "South West Euro Region":                 "http://landregistry.data.gov.uk/id/region/south-west",
  "South East Euro Region":                 "http://landregistry.data.gov.uk/id/region/south-east",
  "London Euro Region":                     "http://landregistry.data.gov.uk/id/region/greater-london",
  "Eastern Euro Region":                    "http://landregistry.data.gov.uk/id/region/east-anglia",
  "East Midlands Euro Region":              "http://landregistry.data.gov.uk/id/region/east-midlands",
  "West Midlands Euro Region":              "http://landregistry.data.gov.uk/id/region/west-midlands-region",
  "North West Euro Region":                 "http://landregistry.data.gov.uk/id/region/north-west",
  "Yorkshire and the Humber Euro Region":   "http://landregistry.data.gov.uk/id/region/yorks-and-humber",
  "North East Euro Region":                 "http://landregistry.data.gov.uk/id/region/north-east"
};
END
puts "return {locationNames: locationNames, locations: locations, gssIndex: gssIndex, regionNameIndex: regionNameIndex };"
puts "}();"
