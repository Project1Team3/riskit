
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
        zoom: 18
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
let queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=200";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    for (i = 0; i < 20; i++) {
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

//On Click Function of ZIP Button via zip-btn class.

$(document).on("click", ".zip-btn", function (event) {
    var zipClicked = $(".zip-input").val().trim();   
    console.log(zipClicked); 

    // searchzip(zipClicked);
})



//Function that takes above data, makes an AJAX call to API, then takes the response and prepends as 
// a Bootstrap card. 

// const searchzip = zip => {
//     $.get("https://api.giphy.com/v1/zips/search?q=" + zip + "&api_key=dc6zaTOxFJmzC").then(data => {

//         for (let i = 0; i < 10; i++) {
//             $(".zipWindow").prepend(`

//             <div class="card" style="width: 25rem;">
//                 <img class="card-img-top still" src="${data.data[i].images.fixed_height_still.url}" data-still='${data.data[i].images.fixed_height_still.url}' data-original='${data.data[i].images.original.url}' height=300 />
//                     <div class="card-body moving">
//                         <p class="card-text">Rated: ${data.data[i].rating}</p>
//                      </div>
//             </div>

                
//             `)
//         }
//     });
// }