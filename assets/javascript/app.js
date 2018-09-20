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
       // icon: "assets/images/ski-mask.png",
        draggable: true
    });
    
    marker.setMap(map)
}



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
   // var lat = [];
   // lat[i] = response.features[i].geometry.coordinates[1];
  //  var lon = [];
  //  lon[i] = response.features[i].geometry.coordinates[0];
    var marker = new google.maps.Marker({
        position: { lat: response.features[i].geometry.coordinates[1], lng: response.features[i].geometry.coordinates[0]},
        map: map,
        title: "Ski Mask Man",
        animation: google.maps.Animation.DROP,
       // icon: "assets/images/ski-mask.png",
        draggable: true
    });
    
    marker.setMap(map)
    
    };

    
  });


