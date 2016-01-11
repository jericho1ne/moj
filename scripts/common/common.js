/*
 * common.js
 *
 **/

// TODO:
//    grab current user location, then look for nearby venues
//    $.when(getUserPosition())
//      .done(YouTubeSearch.displayVideos());


function throwModalError(errorMsg) {
    alert(errorMsg);
}

function deg2rad(deg) {
   return deg * (Math.PI/180);
}


/**
 * getDistance
 * figure out as-the-crow-flies diestance between two points
 *    @param {double} lat1
 * @param {double} lon1
 * @param {double} lat2
 * @param {double} lon3
 */
function getDistance(lat1, lon1, lat2, lon2) {
   var R_km = 6371;  // Radius of the earth in km
   var R_mi = 3958.761; // Radius of the earth in mi
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lon2-lon1);
   var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

   // Distance in miles
   var d = R_mi * c;
   console.log(d.toFixed(4));
   // 4 decimals, in typecast just in case toFixed returns a string...
   return Number ( d.toFixed(4) );
}

//
// DOM function triggers
//

/**
 * getNearbyVenues
 * see what's poppin' near to you
 * @param {int} radius - max search radius
  *   @param {int} limit - how many results
 */
function getNearbyVenues(position, radius, limit) {

    if (typeof position === 'undefined') {
        position = UserState.getSavedUserPosition();
        // TODO:  in case this is not part of a Promise chain,
        // or if globally saved position is still blank, fire off
        // a separate call to geolocate user
    }

    var image_url =
        "http://maps.google.com/maps/api/staticmap?sensor=true&center=" +
        position.lat + "," + position.lon +
        "&zoom=15&size=300x300&markers=color:black|" +
        position.lat + ',' + position.lon;

    // Map
    $('#map').fadeOut(1000);
    $('#map').empty();
    var mapImage = $('<img>')
        .attr('src', image_url)
        .addClass('');

    //$('#map').hide();
    $('#map').append(mapImage);
    $('#map').fadeIn(750);

    // Shows content
    $("#nearby-shows").html('<i class="fa fa-cog fa-spin fa-5x center"></i>');

    // TODO:  move to LINE 127-ish
    Venues.getVenues(
        position,
        radius, // in miles
        limit
    );
}

/**
 * setPageState
 * save the last web app section visited by user
 * @param {string} lastPgVisited - last viewed section
 */
function setPageState(lastPgVisited) {
   // Get current selection from DOM, save in current session
   // $('#pageState').val();
   UserState.setLastPageState(lastPgVisited);
   console.log(" >> setPageState called >> ");
}

/**
 * setUserPosition
 * save user geographic location, then do some promise chaining
 */
function getPos() {
   console.log(" >> getPos() called >> ");

   UserState.geoLocateUser()
    .then(function(position) {
      console.dir(" >> 1 then >> ");
      console.dir(position);
      var coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
      };
      return coordinates;
    })
    .then(function(coordinates) {
      console.dir(" >> 2 then >> ");
      getNearbyVenues(coordinates, 25, 10);
    })
    .then(function() {
      reattachListeners();
    })
    .fail(function(err) {
      console.error(err);
    });

   /*
   $.when(UserState.geoUserPosition())
      .then(
         getDistance(
            vLat, vLon,
            UserState.getUserPosition().lat,
            UserState.getUserPosition().lon
         ))
      .done()
   */
}// End function getPos



/**
 * reattachListeners
 * ensures that buttons do stuff by reattaching listeners after DOM redraw
 */
function reattachListeners() {

  // Bookmark favorite venues
  $('.faveButton').on('click', function() {
    console.log(" venue id " + $(this).data("id"));

    // Save this to favorites
    if ($(this).hasClass('btn-inactive')) {
        UserState.faveVenues.push({
            id: $(this).data("id")
        });
        $(this).removeClass('btn-inactive');
        $(this).addClass('btn-active');
    }// End if
    // Remove venue from favorites
    else {
        $(this).removeClass('btn-active');
        $(this).addClass('btn-inactive');

        for(var i = UserState.faveVenues.length; i--; ) {
            if (UserState.faveVenues[i]['id'] === $(this).id) {
                UserState.faveVenues.splice(i, 1);
            }
        }
    }// End else
  });// End faveButton click


}// End function reattachListeners

