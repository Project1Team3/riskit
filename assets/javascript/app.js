$(document).ready(function () {
    $(window).on('scroll', function () {
        if (Math.round($(window).scrollTop()) > 100) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    })
})

//Global Variables. Required for Map
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
let knotIcon = "assets/images/knottemplate.png"


//Loads the Map screen w/ places request for Bars, Restaurants, Club and Pubs.
function initialize() {
    var center = new google.maps.LatLng(41.8817767, -87.6393348);
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

    google.maps.event.addListener(map, 'click', function (event) {
        map.setCenter(event.latLng)
        //clearResults(markers)
        var lat = event.latLng.lat();
        var lng =  event.latLng.lng();
        console.log(event.latLng)
        var request = {
            location: event.latLng,
            radius: 30000,
            types: ['bar', 'restaurant', 'club', 'pub']
        };
        var crimeLocation = `lat=${lat}&lon=${lng}`;
        var queryURL = `https://opendata.mybluemix.net/crimes?${crimeLocation}&radius=500`;
        marker(queryURL)
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


//ZIP CODE BUTTON RECENTER AND AJAX CALL. Also Keyup for just hitting enter.

$("#submit").keyup(function(event){
    if(event.keyCode === 13){
        $(".zipbutton").click();
    }
});

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
        var queryURL = `https://opendata.mybluemix.net/crimes?${crimeLocation}&radius=500`;
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
        let heatmapData = []
        for (i = 0; i < 50; i++) {
            console.log(response.features[i]);

            console.log(response.features[i].geometry.coordinates[0]);
            console.log(response.features[i].geometry.coordinates[1]);

            // $(".crime").append(` ${response.features[i].geometry.coordinates}, ${response.features[i].properties.desc},  ${response.features[i].properties.type} <br>`)
            // console.log(response.features[i].properties.desc);

            $(".crimeTable").prepend(`
        <tr>
        <th scope="row">${response.features[i].properties.type}</th>
        <td><img src=${crimeIcons(response.features[i].properties.type)}></td>
        <td>${textFormatter(response.features[i].properties.desc)}</td>
        </tr>
        `);
        
          heatmapData.push({location: new google.maps.LatLng(response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]), weight: 1})
          
        let marker = new google.maps.Marker({
            position: { lat: response.features[i].geometry.coordinates[1], lng: response.features[i].geometry.coordinates[0] },
            map: map,
            title: response.features[i].properties.desc,
            content: response.features[i].properties.desc,
            animation: google.maps.Animation.DROP,
            icon: crimeIcons(response.features[i].properties.type),
            draggable: false,
            opacity: .7
        });

        let desc = textFormatter(response.features[i].properties.desc)

          marker.addListener('click', function() {
            let infowindow = new google.maps.InfoWindow({
                content: desc
              });              
            infowindow.open(map, marker);
          });

        marker.setMap(map);
        }
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 150,
            opacity: .35
          });
          heatmap.setMap(map);
    })
}

//INITIAL OPEN CRIME API w/ AJAX Call for first time load. 

let crimeLocation = "lat=41.8817767&lon=-87.6393348";
let queryURL = "https://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=500";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    let heatmapData = []

    for (i = 0; i < 10; i++) {
        console.log(response.features[i].properties.type);
        console.log(response.features[i]);
        console.log(response.features[i].geometry.coordinates[0]);
        console.log(response.features[i].geometry.coordinates[1]);

        heatmapData.push({location: new google.maps.LatLng(response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]), weight: 1})

        // $(".crime").append(` ${response.features[i].geometry.coordinates}, ${response.features[i].properties.desc},  ${response.features[i].properties.type} <br>`)
        // console.log(response.features[i].properties.desc);

        $(".crimeTable").prepend(`
        <tr>
        <th scope="row">${response.features[i].properties.type}</th>
        <td><img src=${crimeIcons(response.features[i].properties.type)}></td>
        <td>${textFormatter(response.features[i].properties.desc)}</td>
        </tr>
        `);

        let marker = new google.maps.Marker({
            position: { lat: response.features[i].geometry.coordinates[1], lng: response.features[i].geometry.coordinates[0] },
            map: map,
            title: response.features[i].properties.desc,
            content: response.features[i].properties.desc,
            animation: google.maps.Animation.DROP,
            icon: crimeIcons(response.features[i].properties.type),
            draggable: false,
            opacity: .7
        });

        let desc = textFormatter(response.features[i].properties.desc)

          marker.addListener('click', function() {
            let infowindow = new google.maps.InfoWindow({
                content: desc
              });              
            infowindow.open(map, marker);
          });

        marker.setMap(map);

        
    };
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 150,
        opacity: .35
      });
      heatmap.setMap(map);
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
        case "07":
            return theftIcon;
            break;
        case "08B":
            return robberyIcon;
            break;
        case "11":
            return knotIcon;
            break;
        case "26":
            return skullIcon;
            break;
        default:
            return crimeIcon;
    }
}

function textFormatter(desc){

    return desc.replace(">", " (") + ")";

};

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

    //for the Review table
    $(".review").append(`
      <tr>
      <th scope="row">${sv.name}</th>
      <td>${sv.place}</td>
      <td>${sv.food}</td>
      <td>${sv.danger}</td>
      <td>${sv.comment}</td>
      
  </tr>
`);

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


//Link to grap values, add to the A tag and load into mailer.
$("#mailer").click(function(){
    let name = $("#name").val();
    let message = $("#message").val();
    let email = $("#inputEmail").val();
    $(this).attr("href", `mailto:joepathetic@yahoo.com?subject=${name}&body=${message}<br> From: ${email}`)
});
