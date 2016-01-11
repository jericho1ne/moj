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

      // Get venues within 25 miles, max 10 results
      // getData('foo').then(function(response){
      //   return $.when(
      //   cache[ val ] || 

      //   $.ajax('/foo/', {
      //       data: { value: val },
      //       dataType: 'j'
      //   })
      // )
      //   $.when()

      /* 
       $.then(function(data, textStatus, jqXHR) {
          console.log(":::::::::::::::::::::::");

          console.log(data);
          console.log(textStatus);
          console.log(jqXHR.status); // Alerts 200
          Events.displayEvents(data, "shows-content");
        });
       */

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

        function getArtistInfo(artistName) {
            console.log(" >> 1) getArtistInfo called");
            // Get Artist Info
            //  http://www.last.fm/api/show/artist.getinfo
            // var artistXHR = $.ajax({
            // var CACHE = {};

            return CACHE[artistName] || $.ajax({
                type: 'POST',
                url: 'http://ws.audioscrobbler.com/2.0/',
                data: 'method=artist.getInfo&' +
                       'artist=' + artistName + '&' +
                       'api_key=' + LASTFM_API_KEY + '&' +
                       'format=json',
                dataType : 'json',
                // Success callback will fire even when couple with an external $.done
                success : function(data) {
                    console.log(' >> artistXHR success >>');
                    // Save current artist data in global cache
                    CACHE[data.artist.name] = data;
                },
                error : function(code, message){
                    // Handle error here
                    // TODO:  change to jquery UI modal that autofades and has (X) button
                    alert("Unable to load Artist data =(");
                }
            });// End artistXHR $.ajax 
        }

        function getTopTracks(artistName) {
            console.log(" >> 2) getTopTracks called");
            // Get Artist Top Tracks
            //   http://www.last.fm/api/show/artist.getTopTracks
            // var topTracksXHR = $.ajax({

            var underscoreLowercaseName = artistName.toLowerCase().replace(/ /g,"_");

            return CACHE[underscoreLowercaseName + '_tracks' ] || $.ajax({
                type: 'POST',
                url: 'http://ws.audioscrobbler.com/2.0/',
                data: 'method=artist.getTopTracks&' +
                       'artist=' + artistName + '&' +
                       'api_key=' + LASTFM_API_KEY + '&' +
                       'format=json',
                dataType : 'json',
                // Success callback will fire even when couple with an external $.done
                success : function(data) {
                    console.log(' >> topTracksXHR success >>');

                    // Cache track data to avoid future calls
                    var underscoreLowercaseName = data.toptracks['@attr'].artist.toLowerCase().replace(/ /g, '_');
                    CACHE[underscoreLowercaseName + '_tracks'] = data;
                },
                error : function(errorCode, errorMsg) {
                    // Handle error here
                    // TODO:  change to jquery UI modal that autofades and has (X) button
                    var msg = 'Unable to load Top tracks for <b>' + + '</b>';
                    alert(msg + '<br>' + errorMsg + '(' + errorCode + ')');
                }
            });// End topTracksXHR $.ajax 
        }

        function appendArtistInfo(divId, data) {
            // Create custom info array
            var artist = {
                'name': data.artist.name,
                'bio': data.artist.bio,
                'url': data.artist.url,
                'images': data.artist.image,
                'tags': data.artist.tags.tag
            };
          
            // Clip bio at 200 characters max
            var shortBio = artist.bio.summary.substring(0, 200);

            // If longer than max amount, add "show more" link
            if (data.artist.bio.summary.length > 200) {
                shortBio += '... <a href="#">[ more ]</a>';
            }

            $('#' + divId).html(artist.name 
                + '<br>' 
                + shortBio 
                + '<br>' 
                + '<img src="' + artist.images[2]['#text'] + '">');
        }

        function appendTopTracks(divId, data) {
             console.log(data.toptracks.track);
             window.topTrackData = data;
        }

        // Promise chain 
        //  - get artist info, display it, get top tracks, display them
        getArtistInfo(artistName)
            .then(function(data) {
                appendArtistInfo('artist-info', data);
            });

        getTopTracks(artistName)
            .then(function(data) {
            
                appendTopTracks('artist-info', data);
            });

        // $.when(getArtistInfo).done(function(artistInfo) {
        //     console.log(artistInfo);
        //     // Handle both XHR objects
        //     console.log(" >>>  $.when.done() complete");
        // });

    });

   // Events.getEvents("shows-content", 10);



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


   // TODO:
   // need an object to hold array of shows and associated methods: print, etc.


   // TODO: foreach looping over all venues

   // TODO:  Include node geolocation module
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

   console.log("doc ready");

   function getVideoStats(videoId) {
      console.log("videoId :: " + videoId);
   }
   */

  

});// End on Document Load
