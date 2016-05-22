/**
 * @file common.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2016 Middle of June.  All rights reserved.
 *
 * Helper functions
 */

function rvStr(s) {
  return s.split('').reverse().join('');
}

function throwModalError(errorMsg) {
  alert(errorMsg);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function strToLowerNoSpaces(str) {
  return str.toLowerCase().replace(/ /g,"_");
}

String.prototype.ucwords = function() {
  str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function($1){
        return $1.toUpperCase();
    });
}

function fileExists(fileUrl) {
  var http = new XMLHttpRequest();
  http.open('HEAD', fileUrl, false);
  http.send();
  return http.status != 404;
}

function fileExistsAjax(fileUrl) {
  $.ajax({
    url: fileUrl,
    type:'HEAD',
    error: function() {
      return false;
    },
    success: function() {
      return true;
    }
  });
}

function stripSpaces(str) {
    // originally / /g
    return str.toLowerCase().replace(/\W+/g,"+");
}

function clearDiv(divId, loading) {
  $('#' + divId).html('');
  if (loading) {
    $('#' + divId).html('<div class="col-md-12 opacity-80">'+
      '<div class="loading"></div>' +
      '</div>');
  }
}

function cleanArtistName(artistName) {
    var formattedName = String(artistName);

    // Strip unnecessary stuff
    formattedName.replace('& more', '');
    formattedName.replace('&more', '');

    // Replace spaces w/ pluses
    formattedName.replace(/ /g, "+");

    // Search for "w/" and return both halves,
    // hoping that one of the two will yield a result
    if (formattedName.search('w/') !== -1) {
        //console.log(formattedName);
        tempArray = formattedName.split('w/');
        formattedName = [
            tempArray[0].trim(), 
            tempArray[1].trim()
        ];
        //console.log(formattedName);
    }

    // First check whether this artist has an alias
    if (typeof ARTIST_ALIASES[artistName] !== 'undefined') {
        formattedName = ARTIST_ALIASES[artistName];
    }
    
    // Replace spaces with +
    return formattedName;
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
    $("#nearby-shows").html('<div class="loading center"></div>');

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
 * getPosition
 * save user geographic location, then do some promise chaining
 */
function getPosition() {
   console.log(" >> getPosition() called >> ");

   // Try to find the user's position, passing in timeout in ms
   UserState.geoLocateUser(7000)
   
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
        // reattachListeners();
        $('#range-slider').slider('enable')
    })
    .fail(function(err) {
        console.error(err);
    });
}// End function getPosition


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

function buildSharingLink(eventId) {
    return window.location.origin + window.location.pathname 
        + '#event=' + eventId;
}

function isBlank(thisVar) {
    if (typeof thisVar !== 'undefined') {
        if (typeof thisVar === 'object') { // figure out object.length substitute} && thisVar.length) {
            return false;
        }
        else if ((typeof thisVar === 'string' || typeof thisVar === 'number') 
          && thisVar != '') {
            return false;
        }
    }
    return true;
}

function parseUrlDomain(url, size) {
    var domain;
    // Find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    // Remove port number, if any
    domain = domain.split(':')[0];

    if (size === "short") {

      return (domain.split('.')[0] === 'www' ? domain.split('.')[1] : domain.split('.')[0]);
    }
    return domain;
}

function parseUrlAction() {
    var host = window.location.host;
    var path = window.location.pathname;
    var request = window.location.href.split('#');
    var urlString = request[1];

    // See if there was even a hashtag passed in
    if (!isBlank(urlString)) {
        var params = request[1].split('=');

        // If there's stuff to do
        if (!isBlank(params[0]) && !isBlank(params[1])) {
            // Load artist/show data differently based on source
            switch(params[0]) {
                case 'event':
                    var requestedEvent = Events.getEventById(params[1]);
                    // If event info exists
                    if (!isBlank(requestedEvent)) {
                        // Allow bootstrap modal to load
                        setTimeout(function() {
                            lookupArtist(requestedEvent);
                        }, 500);
                    }// End if event info exists
                    break;
                case 'venue':
                    break;
                case 'zip':
                    break;
                default:
                    // default case 
            }// End switch
        }
    }// End if urlString is not blank
}// End parseUrlAction
