$(document).ready(function () {
    $('.togglebtn').click(function () {

        if(!$('#map_canvas').is(':visible')){
            setTimeout(function(){initialize()}, 500);
        }
    });
});
function initialize() {
    var map = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(50.4471344, 30.4558392),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map, mapOptions)
}
google.maps.event.addDomListener(window, 'load', setTimeout("initialize()", 500));