//
// main.js
//

// On document load
$(document).ready(function() {
  window.Events = Events;

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
    getNearbyVenues(25, 4);
  });

  $('#setPageState').click(function() {
    // Parse the hashtag section from URL
    var lastSection = window.location.href.split("/").pop();

    // Save the last visited page
    setPageState(lastSection);
  });

  // Get user's location and display it
  // getPos();

  // Get list of shows, display them, set click listeners on each Artist
  //
  // $when is same as:
  //      var eventPromise = Events.getEvents(10);
  //      eventPromise.then(function(data)) ...
  //
  $.when(Events.getEvents(10))
    // returns $.ajax
    .then(function(data) {
      // JSON data will go into shows-content div
      return $.when(Events.displayEvents(JSON.parse(data), 'shows-content'));
    })
    .then(function() {
      // TODO: save in localStorage so we don't have to reload upon refresh
      // var $eventDataTable = Events.getEventData(); 
      
      // Click listeners for currently shown page of events
      Events.applyArtistListeners();

      // Click listeners for pagination change (re-applies Artist listeners)
      Events.applyPaginationListeners();
    });


  // grab JSON api data, then display
  /*$.when(YouTubeSearch.getVideos("Dilated", 30))
    .done(YouTubeSearch.displayVideos()); */

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
