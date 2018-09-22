$(document).ready(function() {
    $(window).on('scroll', function() {
      if (Math.round($(window).scrollTop()) > 100) {
        $('.navbar').addClass('scrolled');
      } else {
        $('.navbar').removeClass('scrolled');
      }
    })
})
 

var map;
var infowindow = new google.maps.InfoWindow();

var request;
var service;
var markers = [];


function initialize() {
    var center = new google.maps.LatLng(41.8809195,-87.6276138);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 17
    });

    request = {
        location: center,
        radius: 30000,
        types: ['bar', 'restaurant', 'club', 'pub']
    };


    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    google.maps.event.addListener(map, 'rightclick', function (event) {
        map.setCenter(event.latLng)
        clearResults(markers)

        var request = {
            location: event.latLng,
            radius: 30000,
            types: ['bar', 'restaurant', 'club', 'pub']
        };
        service.nearbySearch(request, callback);
    })
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
        infowindow.setContent(place.name);
    })
    return marker;
}
google.maps.event.addDomListener(window, 'load', initialize)
zip();
//marker();

function zip() {
    var zip = 60603
    let zipURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyAEbmR9tGPSpWie_laz4e2EBDOIdgGp_gE"

    $.ajax({
        url: zipURL,
        //dataType: "json",
        method: "GET"
    }).then(function (response) {
        // var json = $.parseJSON(response)
        console.log(response)
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        lat = lat.toFixed(4);
        lng = lng.toFixed(4)
        console.log(lat)
        console.log(lng)
        //var lat = 41.8986
        //var lng = -87.6628
        var crimeLocation = `lat=${lat}&lon=${lng}`;
        var queryURL = `http://opendata.mybluemix.net/crimes?${crimeLocation}&radius=500`;
        // var queryURL = "http://opendata.mybluemix.net/crimes?lat=" + lat + "&lon=" + lng + "&radius=500";
        marker(queryURL)

    })
}

function marker(queryURL) {
    //var queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=500";
    $.ajax({
        url: queryURL,
        dataType: "json",
        method: "GET"
    }).then(function (response) {
        /*response.features.length*/
        for (i = 0; i < 50; i++) {
            console.log(response.features[i]);

            console.log(response.features[i].geometry.coordinates[0]);
            console.log(response.features[i].geometry.coordinates[1]);
            $(".crime").append(` ${response.features[i].geometry.coordinates}, ${response.features[i].properties.desc},  ${response.features[i].properties.type} <br>`)
            console.log(response.features[i].properties.desc);
            // $(".crime").append(response.features[i].properties.desc)
            var marker = new google.maps.Marker({
                position: { lat: response.features[i].geometry.coordinates[1], lng: response.features[i].geometry.coordinates[0] },
                map: map,
                title: response.features[i].properties.desc,
                animation: google.maps.Animation.DROP,
                icon: "assets/images/robbery.png",
                draggable: true
            })

            marker.setMap(map)
        }
    })
}
//});
