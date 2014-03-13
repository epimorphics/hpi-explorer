# The locations command object provides an API for traversing the
# location hierarchy in the HPI dataset
class Location < DataService
  attr_reader :json

  def initialize( location_uri )
    super
    @id = location_uri
    puts "@id #{@id}"
    @hpi = dataset( :hpi )
    puts "@hpi #{@hpi}"
    @json = @hpi.describe( location_uri )
    puts "@json #{@json}"
    @labels = {location_uri => @json["label"]}
    puts "@labels #{@labels}"
  end

  def within
    labelled( json["within"] )
  end

  def contains
    Array( json["contains"] ).map {|v| labelled( v )}
  end

  def name
    label_for( @id )
  end

  def labelled( uri )
    return nil unless uri
    uri.kind_of?( Hash ) ? uri : {"@id" => uri, "label" => label_for( uri )}
  end

  def label_for( uri, lang = "en" )
    l = labels( uri ).find {|l| l.kind_of?(Hash) ? l["@language"] == lang : true}
    return l unless l.kind_of?( Hash )
    l["@value"]
  end

  def labels( uri )
    unless @labels.has_key?( uri )
      l = @hpi.describe( uri )["label"]
      @labels[uri] = l.kind_of?( Array ) ? l : [l]
    end
    @labels[uri]
  end


end
