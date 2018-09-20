//GOOGLE MAPS API
//line to create a "New Map". Requires that you pass the DOM, 
// A "Center" in Lat and Lng, and a zoom level.     

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.852461, lng: -87.6409744 },
        zoom: 17
    });

}

// function getLatLngZip(zipcode) {
//     var geocoder = new google.maps.Geocoder();
//             var address = zipcode;
//             geocoder.geocode({ 'address': address }, function (results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     var latitude = results[0].geometry.location.lat();
//                     var longitude = results[0].geometry.location.lng();
//                     alert("Latitude: " + latitude + "\nLongitude: " + longitude);
//                 } else {
//                     alert("Request failed.")
//                 }
//             });
//             console.log([latitude, longitude]);
//             return [latitude, longitude];
//     }



$(document).ready(function () {

    // getLatLngZip(60026);


    let crimeLocation = "lat=41.852461&lon=-87.6409744"
    let queryURL = "http://opendata.mybluemix.net/crimes?" + crimeLocation + "&radius=500";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < 30; i++) {
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
                // icon: "assets/images/ski-mask.png",
                draggable: true
            });

            marker.setMap(map)


        };

    });




});
