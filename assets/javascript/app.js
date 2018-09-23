$(document).ready(function () {
    $(window).on('scroll', function () {
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

//VARs for all the crime icons
let robberyIcon = "assets/images/robbery.png";
let theftIcon = "assets/images/theft.png";
let shootingIcon = "assets/images/shooting.png";
let crimeIcon = "assets/images/crimescene.png";
let bombIcon = "assets/images/bomb.png";
let skullIcon = "assets/images/pirates.png"



function initialize() {
    var center = new google.maps.LatLng(41.8817767, -87.6393348);
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


//ZIP CODE BUTTON RECENTER AND AJAX CALL

$(".zipbutton").on("click", function zip(event) {
    var zip = $(".zipinput").val().trim()
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
        map.setCenter(new google.maps.LatLng(`${lat}`, `${lng}`));
        var crimeLocation = `lat=${lat}&lon=${lng}`;
        var queryURL = `http://opendata.mybluemix.net/crimes?${crimeLocation}&radius=500`;
        marker(queryURL)

    })
})

function marker(queryURL) {
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
                icon: crimeIcons(response.features[i].properties.type),
                draggable: true
            })

            marker.setMap(map)
        }
    })
}

//INITIAL OPEN CRIME API w/ AJAX Call. 

let crimeLocation = "lat=41.8817767&lon=-87.6393348";
let queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=500";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    for (i = 0; i < 10; i++) {
        console.log(response.features[i].properties.type);
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
            icon: crimeIcons(response.features[i].properties.type),
            draggable: true
        });

        marker.setMap(map)


    };
});

//Switch statement for assigning crime icons to Ajax call codes
function crimeIcons(crimeID) {

    switch (crimeID) {
        case "03":
            return shootingIcon;
            break;
        case "06":
            return theftIcon;
            break;
        case "08B":
            return robberyIcon;
            break;
        case "26":
            return skullIcon;
            break;
        default:
            return crimeIcon;
    }
}

//Comment Cards connected to FireBase

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA94oLjra38WWILGLTlxi1sMY02qZHAHCE",
    authDomain: "riskit-1537281695115.firebaseapp.com",
    databaseURL: "https://riskit-1537281695115.firebaseio.com",
    projectId: "riskit-1537281695115",
    storageBucket: "riskit-1537281695115.appspot.com",
    messagingSenderId: "331530995468"
  };
  firebase.initializeApp(config)

// Create a variable to reference the database.
var database = firebase.database();

// Capture Button Click
$("#add-user").on("click", function (event) {
    // prevent page from refreshing when form tries to submit itself
    event.preventDefault();

    // Capture user inputs and store them into variables
    var name = $("#name-input").val().trim();
    var place = $("#place-input").val().trim();
    var food = $("#food-input").val().trim();
    var danger = $("#danger-input").val().trim();
    var comment = $("#comment-input").val().trim();


    // Code for handling the push
    database.ref("/users").push({
        name: name,
        place: place,
        food: food,
        danger: danger,
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

// Firebase watcher .on("child_added"
database.ref("/users").on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Change the HTML to reflect
    $("#name-display").text(sv.name);
    $("#place-display").text(sv.place);
    $("#food-display").text(sv.food);
    $("#danger-display").text(sv.danger);
    $("#comment-display").text(sv.comment);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// By default display the content from localStorage
$("#name-display").text(localStorage.getItem("name"));
$("#place-display").text(localStorage.getItem("place"));
$("#food-display").text(localStorage.getItem("food"));
$("#danger-display").text(localStorage.getItem("danger"));
$("#comment-display").text(localStorage.getItem("comment"));
