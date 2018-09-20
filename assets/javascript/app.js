//GOOGLE MAPS API
//line to create a "New Map". Requires that you pass the DOM, 
// A "Center" in Lat and Lng, and a zoom level. 

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.8986, lng: -87.6628 },
        zoom: 17
    });


    var marker = new google.maps.Marker({
        position: { lat: 41.8986, lng: -87.6628 },
        map: map,
        title: "Ski Mask Man",
        animation: google.maps.Animation.DROP,
        icon: "assets/images/ski-mask.png",
        draggable: true
    });
    
    marker.setMap(map)
}



//CRIMESPOT API

// var request = require('request');

// var baseUrl = "http://api.spotcrime.com/crimes.json";
// var key = "privatekeyforspotcrimepublicusers-commercialuse-877.410.1607";

// module.exports = function(loc, radius, cb) {
//   if (typeof radius === 'function') {
//     cb = radius;
//     radius = 0.01;
//   }

//   var rOpt = {
//     url: baseUrl,
//     json: true,
//     qs: {
//       lat: loc.lat,
//       lon: loc.lon,
//       key: key,
//       radius: radius
//     }
//   };

//   request(rOpt, function(err, res, body) {
//     if (err) return cb(err);
//     if (!body) return cb(new Error("No response"));
//     cb(null, body.crimes);
//   });

// };

// $.ajax({
//     type: "get",
//     url: "http://api.spotcrime.com/crimes.json", 
//     dataType: "jsonp", 
//     contentType: "application/json", 
//     success: function(data){console.log(data)}
// })

let crimeLocation = "lat=41.8986&lon=-87.6628"
let queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=200";
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    for(i = 0; i < 10; i++){
    console.log(response.features[i]);
    
    console.log(response.features[i].geometry.coordinates[0]);
    console.log(response.features[i].geometry.coordinates[1]);
    $(".crime").append(` ${response.features[i].geometry.coordinates}, ${response.features[i].properties.desc},  ${response.features[i].properties.type} <br>`)
    console.log(response.features[i].properties.desc);
    // $(".crime").append(response.features[i].properties.desc)
    var marker = new google.maps.Marker({
        position: { lat: response.features[i].geometry.coordinates[1], lng: response.features[i].geometry.coordinates[0]},
        map: map,
        title: "Ski Mask Man",
        animation: google.maps.Animation.DROP,
        icon: "assets/images/ski-mask.png",
        draggable: true
    });
    
    marker.setMap(map)
    };

    
  });


