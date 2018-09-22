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
        //icon: "assets/images/ski-mask.png",
        draggable: true
    });

    marker.setMap(map)
}
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
                title: "Ski Mask Man",
                animation: google.maps.Animation.DROP,
                //icon: "assets/images/ski-mask.png",
                draggable: true
            })

            marker.setMap(map)
        }
    })
}
