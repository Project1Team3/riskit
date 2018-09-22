// Google Maps & Places API
var map;
var infowindow = new google.maps.InfoWindow();

var request;
var service;
var markers = [];


function initialize() {
    var center = new google.maps.LatLng(41.8882457, -87.6310917);
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

function clearResults(markers) {
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

//OPEN CRIME API w/ AJAX Call.

let crimeLocation = "lat=41.8882457&lon=-87.6310917"
let queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=500";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    for (i = 0; i < 25; i++) {
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
        });

        marker.setMap(map)


    };

});