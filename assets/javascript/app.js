//Global Variables. Required for Map
var map;
var infowindow = new google.maps.InfoWindow();

var request;
var service;
var markers = [];
var heatmaps = [];
var crimeID = [];
let chicago = { lat: 41.8817767, lng: -87.6393348 };

//VARs for all the crime icons
let robberyIcon = "assets/images/robbery.png";
let theftIcon = "assets/images/theft.png";
let shootingIcon = "assets/images/shooting.png";
let crimeIcon = "assets/images/crimescene.png";
let bombIcon = "assets/images/bomb.png";
let skullIcon = "assets/images/pirates.png"
let knotIcon = "assets/images/knottemplate.png"



//Loads the Map screen w/ places request for Bars, Restaurants, Club and Pubs.
//Creates internal controls for markers
function initialize() {
    let center = new google.maps.LatLng(41.8817767, -87.6393348);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 18
    });

    //Creation of Custom Buttons Inside the Map
    let hideControlDiv = document.createElement('div');
    let showControlDiv = document.createElement('div');
    let removeControlDiv = document.createElement('div');
    let centerControl = new CenterControl(hideControlDiv, map);
    let showControl = new CenterControl2(showControlDiv, map);
    let removeControl = new CenterControl3(removeControlDiv, map);
    

    hideControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(hideControlDiv);

    showControlDiv.index = 2;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(showControlDiv);

    removeControlDiv.index = 3;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(removeControlDiv);

    

    //Google Places for Bars and Restaurants
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
        var lng = event.latLng.lng();
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
function clearMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

}
function showMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    for (i = 0; i < heatmaps.length; i++) {
        heatmaps[i].setMap(null)
    }
    heatmaps = [];
    crimeID = [];
}

//functions for Map Button Controls
function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to Hide Markers';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Hide Markers';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        clearMarkers();
    });

}

function CenterControl2(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to Show Markers';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show Markers';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        showMarkers();
    });

}

function CenterControl3(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to Remove Markers';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Remove All';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
        deleteMarkers();
    });
}
function clearMarkers(){
    for(i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }

}
function showMarkers() {
    for(i = 0; i < markers.length; i++){
        markers[i].setMap(map);
    }
  }

  // Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    for(i = 0; i < heatmaps.length; i++){
        heatmaps[i].setMap(null)
    }
    heatmaps = [];
    crimeID = [];
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

$("#submit").keyup(function (event) {
    if (event.keyCode === 13) {
        $(".zipbutton").click();
    }
});

$(".zipbutton").on("click", function zip(event) {
    var zip = $(".zipinput").val().trim()
    let zipURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyAEbmR9tGPSpWie_laz4e2EBDOIdgGp_gE"

    $.ajax({
        url: zipURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        lat = lat.toFixed(4);
        lng = lng.toFixed(4);
        console.log(lat)
        console.log(lng)
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
        var heatmapData = []
        
        for (i = 0; i < 50; i++) {
            let compnos = response.features[i].properties.compnos
            console.log(response.features[i]);
            console.log(response.features[i].geometry.coordinates[0]);
            console.log(response.features[i].geometry.coordinates[1]);
            
            //screens to see if marker already exists. If not, it add to map
            if(crimeID.includes(compnos) === false){
                
                crimeID.push(compnos);
            $(".crimeTable").prepend(`
        <tr>
        <th scope="row">${response.features[i].properties.type}</th>
        <td><img src=${crimeIcons(response.features[i].properties.type)}></td>
        <td>${textFormatter(response.features[i].properties.desc)}</td>
        </tr>
        `);

            heatmapData.push({ location: new google.maps.LatLng(response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]), weight: 1 })

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

            marker.addListener('click', function () {
                let infowindow = new google.maps.InfoWindow({
                    content: desc
                });
                infowindow.open(map, marker);
            });
            markers.push(marker)
        }
    }
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 150,
            opacity: .35
        });
        heatmaps.push(heatmap);
        //heatmap.setMap(map);
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map)
        }
        for (i = 0; i < heatmaps.length; i++) {
            heatmaps[i].setMap(map)
        }
    })

}

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

function textFormatter(desc) {

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
$("#mailer").click(function () {
    let name = $("#name").val();
    let message = $("#message").val();
    let email = $("#inputEmail").val();
    $(this).attr("href", `mailto:joepathetic@yahoo.com?subject=${name}&body=${message}<br> From: ${email}`)
});
//navbar scroll
$(document).ready(function () {
    $(window).on('scroll', function () {
        if (Math.round($(window).scrollTop()) > 100) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    })
})



