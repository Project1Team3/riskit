
//line to create a "New Map". Requires that you pass the DOM, 
// A "Center" in Lat and Lng, and a zoom level. 

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.270122, lng: -97.751612 },
        zoom: 17
    });


    var marker = new google.maps.Marker({
        position: { lat: 30.2675544, lng: -97.7406445 },
        map: map,
        title: "Bat Bar"
    });
}

marker.setMap(map)




