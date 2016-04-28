/*
 * MapGeo.js
 *
 **/


/*------------------------------------------------------------------------------
	geolocation success callback
------------------------------------------------------------------------------*/
var success = function (position) {
	console.log(" >>>>>>>>  success! ");

	return coords;

	/*
	var s = document.querySelector('#status');

	if (s.className == 'success') {
		// not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back

		return;
	}

	s.innerHTML = "found you!";
	s.className = 'success';

	var mapcanvas = document.createElement('div');
	mapcanvas.id = 'mapcanvas';
	mapcanvas.style.height = '400px';
	mapcanvas.style.width = '560px';

	document.querySelector('article').appendChild(mapcanvas);

	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeControl: false,
		navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
	});*/
}

/*------------------------------------------------------------------------------
	geolocation error callback
------------------------------------------------------------------------------*/
var error = function (msg) {
	/* var s = document.querySelector('#status');
	s.innerHTML = typeof msg == 'string' ? msg : "failed";
	s.className = 'fail'; */
	console.log(msg);
	console.log(arguments);
}

/*--------------------------------------------------------------------------
	geolocation error callback
--------------------------------------------------------------------------*/
var getUserPosition = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	}
	else {
		error('not supported');
	}
}// End method getUserPosition

