//
// main.js
//

// On document load
$(document).ready(function() {

    //
    // LISTENERS
    //
    $('#getPos').click(function() {
        // Get venues within 25 miles, max 10 results
        getPos();
    });

    // Get events data ajax call, push to DOM
    $('#getEvents').click(function() {
        // 
    });// End getEvents

    $('#getNearbyVenues').click(function() {
        // Get venues within 25 miles, max 10 results
        getNearbyVenues(25, 10);
    });


    $('#setPageState').click(function() {
        // Parse the hashtag section from URL
        var lastSection = window.location.href.split("/").pop();

        // Save the last visited page
       setPageState(lastSection);
    });


    $('.artistInfo').click(function() {
        // Same as using the more specific $(this).attr('data-val') 
        var artistName = $(this).html();  

        // Promise chain 
        //  - get artist info, display it, get top tracks, display them
        Artist.getArtistInfo(artistName)
            .then(function(artistData) {
                Artist.appendArtistInfo('artist-bio', artistData);
            });

        Artist.getTopTracks(artistName)
            .then(function(trackData) {
                Artist.appendTopTracks('artist-tracks', trackData);
            });

    });// artistInfo .click


    // Get list of shows
    Events.getEvents('shows-content', 10);

   //
   //  ACTIONS
   //

    // 1) Get user location
    // 2) Get nearby venues, current distance to each, and related shows
    //     EG:
    //         - Troubadour (2.3 mi)
    //             * Show 1
    //             * Show 2
    //             * Show 3
    //         - Molly malone's (5 mi)
    //             *
    //             *
    //             *
    //         etc...
    // 3) Save nearby venues in global object
    // 3) Display in div

    // getPos();


    // UserState.setNearbyVenues(venues);

  // $.when(UserState.geoLocateUser())
  //   .done(
  //     Venues.getVenues(
  //        UserState.getSavedUserPosition(),  // sends lat, lon, etc array
  //        25, // in miles
  //        3
  //     )
  //   );

   // Pass in a callback to our user location finder function,
   // in this case, to redraw the nearby place list

   // TODO FUTURE:  Include node geolocation module
   // var geo = require("includes/geolocation.js");

   /*
   function savePageState() {
      // Get current selection from DOM, save in current session
      // $('#pageState').val();
      UserSession.saveLastPageState("index");
      console.log(" >> savePageState called >> ");
   }

   $.getJSON('../dist/data/shows.json', function(data) {
       console.log(data);
       console.log("hi");
   });


   function getVideoStats(videoId) {
      console.log("videoId :: " + videoId);
   }
   */


});// End on Document Load
