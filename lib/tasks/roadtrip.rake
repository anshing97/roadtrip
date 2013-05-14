namespace :roadtrip do


  desc "Towns and Cities"
  task :towns => :environment do
    
    # filter params 
    params = {}
    params[:origin] = "Brooklyn, NY"
    params[:destination] = "Jersey City, NJ"

    # get the directions to go there via google maps
    directions = GoogleDirections.new(params[:origin],params[:destination])
    directions = Crack::XML.parse(directions.xml)

    # conver intermediate steps
    all_coordinates = directions['DirectionsResponse']['route']['leg']['step'].map do | step |  
      { :latitude => step['start_location']['lat'],
        :longitude => step['start_location']['lng'] }
    end 

    # this is the distance
    distance = directions['DirectionsResponse']['route']['leg']['distance']['value']

    # add final destination in
    last_coordinate = { :latitude => directions['DirectionsResponse']['route']['leg']['end_location']['lat'],
                        :longitude => directions['DirectionsResponse']['route']['leg']['end_location']['lng'] }

    all_coordinates.push(last_coordinate);

    # puts all_coordinates.to_json

    # loop through to examine the data
    all_places = all_coordinates.map do | coordinate | 

      location = coordinate[:latitude].to_s + ", " + coordinate[:longitude].to_s

      place_names = Geocoder.search(location)

      # puts '----------' + location + '-----------'
      # place_names.each do | name | 
      #   puts name.types.to_s + "\t\t" + name.formatted_address + "\t\t" + name.coordinates.to_s
      # end 

      # find by this order
      possible_names = place_names.select { | name | name.types[0] == "sublocality" }
      possible_names = place_names.select { | name | name.types[0] == "locality" } if possible_names.empty?
      possible_names = place_names.select { | name | name.types[0] == "administrative_area_level_3" } if possible_names.empty?

      # puts "-- begin selected ---- "
      # possible_names.each do | name |
      #   puts "\t" + name.types.to_s + "\t\t" + name.formatted_address + "\t\t" + name.coordinates.to_s
      # end      
      # puts "-- end selected ------ "

      possible_names.first

    end 

    # remove nils and sort out just distinct places
    all_places.compact!.uniq! { | place | place.formatted_address } 

    # examime what we have right now 
    all_places.each do | place | 
      puts "\t" + place.types.to_s + "\t\t" + place.formatted_address + "\t\t" + place.coordinates.to_s 
    end

    place_names = all_places.map do | place | 
      place.formatted_address.tap { |s| s.slice!(', USA')}.delete('0-9')
    end 

    # get photos for each location  
    places_and_photos = place_names.map do | place | 

      # create the query to flickr
      args = {}
      args[:tags] = place
      args[:tag_mode] = "all"
      args[:is_common] = true
      args[:has_geo] = true
      args[:sort] = "relevance"
      args[:per_page] = 20

      args[:text] = place

      # find the pictures
      photos_found = flickr.photos.search args

      puts place + " found " + photos_found.length.to_s

      if ( photos_found.length >= 20 ) then 

        photos = photos_found.map do | p | 
          data = {}
          data[:imageURL] = FlickRaw.url_m p 
          data[:flickrURL] = FlickRaw.url_photopage p
          data
        end 

        place_data = {}
        place_data[:photos] = photos
        place_data[:name] = place
        # place_data[:coordinates] = place.coordinates

        # return the data we could use
        place_data 

      else 

        # return nil if there is nothing 
        nil 

      end 

    end

    response = {}
    response[:towns] = places_and_photos.compact
    response[:distance] = distance 

    first = true
    strings = place_names.map { | p | if first then first = false; "from:" + p else "to:" + p end }

    response[:googleMaps] = strings.join(' ').split(' ').join('+')

    puts response.to_json

  end



  # road trip search
  desc "Application Test"
  task :api_test => :environment do

    args = {}
    args[:tags] = "Tucson, AZ"
    args[:tag_mode] = "all"
    args[:is_common] = true
    args[:has_geo] = true
    args[:sort] = "relevance"
    args[:per_page] = 20
    args[:extras] = "url_n"

    discovered_pictures = flickr.photos.search args

    puts discovered_pictures.length

    photos = discovered_pictures.each do |p| 
      puts FlickRaw.url p 
    end 

    puts discovered_pictures.to_json

  end


end 
