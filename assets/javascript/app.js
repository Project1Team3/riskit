    
    //line to create a "New Map". Requires that you pass the DOM, 
    // A "Center" in Lat and Lng, and a zoom level. 
    
    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 30.270122, lng: -97.751612 },
            zoom: 17
        });
    }

