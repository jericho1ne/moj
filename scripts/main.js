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

    // Reattach click listeners on new data
   // $("#nearby-shows").bind("DOMSubtreeModified", function() {
        // Favorite button was clicked
        $('.faveButton').on('click', function() {
            console.log($(this));

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
        });
   // });// End ("#nearby-shows").bind

   // Events.getEvents("shows-content", 10);



   //
   //  ACTIONS
   //

    /*
        1) Get user's location

        2) Get nearby venues, current distance to each, and related shows
            EG:
                - Troubadour (2.3 mi)
                    * Show 1
                    * Show 2
                    * Show 3
                - Molly malone's (5 mi)
                    *
                    *
                    *
                etc...

        3) Save nearby venues in global object

        3) Display in div
    */
    getPos();


    // UserState.setNearbyVenues(venues);

   /*$.when(UserState.geoLocateUser())
         .done(
            Venues.getVenues(
               UserState.getSavedUserPosition(),  // sends lat, lon, etc array
               25, // in miles
               3)
         );

   )*/
   // Get events data through ajaxy means, then push it to the DOM

  //   $.when(Events.getEvents("shows-content", 10))

   /*.then(function(data, textStatus, jqXHR) {
      console.log(":::::::::::::::::::::::");

      console.log(data);
      console.log(textStatus);
      console.log(jqXHR.status); // Alerts 200
      Events.displayEvents(data, "shows-content");

   });
   */

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


   // Youtube API globals
   var apiKey = "AIzaSyCF4m5XE3VTOUzo8b10EstraU1depENiB4";
   // var playlistIds = [
      "PLLtM6mCpibb-3jk6YbbaZtIBzcxAPxIIj",
      "PLLtM6mCpibb87Ee_bbDB11MXyDmjxh2e4"];

   console.log('check one two'); // eslint-disable-line no-console

   $.getJSON('../dist/data/shows.json', function(data) {
       console.log(data);
       console.log("hi");
   });

   console.log("doc ready");

   function getVideoStats(videoId) {
      console.log("videoId :: " + videoId);
   }


   var YouTubeSearch = {
      // PROPERTIES
      apiKey:  "AIzaSyCF4m5XE3VTOUzo8b10EstraU1depENiB4",
      baseURL:    "https://www.googleapis.com/youtube/v3/",
      videosList: [],
      favoritesList: [],
      playlists: ['PLLtM6mCpibb87Ee_bbDB11MXyDmjxh2e4'],


      // METHODS
      // searchForArtist(artist_name, max_results, ordering);

      //----------------------------------------------------------------------------------
      //    getAllUserPlaylists
      //
      //----------------------------------------------------------------------------------
      getAllUserPlaylists: function(userId) {
         // TODO: write code
      },

      //----------------------------------------------------------------------------------
      //    getPlaylistVideos
      //
      //----------------------------------------------------------------------------------
      getPlaylistVideos: function(playlistId, maxResults) {
         console.log(" >> getPlaylistVideos >> ");
         // we'll need this refernce later inside the $.ajax scope
         var _this = this;

         var requestBody = {
            type:    "GET",
            url:  this.baseURL +
                  "playlistItems?part=snippet&" +
                  "maxResults="+maxResults +
                  "&playlistId="+playlistId +
                  "&key="+this.apiKey,
            async: false
         };// End requestBody

         $.ajax(requestBody).done(function(data, status) {
            if (status === 'success') {
               if (data) {
                  //console.log(data);
                  _this.videosList = data.items;
                  return true;
               }
            }
            else {
               alert("No videos found :(");
               return false;
            }
         });//End $.ajax
      },// End getPlaylistVideos

      //----------------------------------------------------------------------------------
      //    displayVideos
      //
      //----------------------------------------------------------------------------------
      displayVideos: function() {
         console.log(' >> displayVideos >> ');
         var vids = this.videosList;

         for (key in vids) {
            console.log( vids[key] );
            // vids[0].id
            // vids[0].snippet.thumbnails.title
            // vids[0].snippet.thumbnails.medium.url     // .width=320, height=180
            // vids[0].snippet.thumbnails.high.url          // .width=480, height=360
            // vids[0].snippet.thumbnails.standard.url      // .width=640, height=480

            var imgContainer = $('<li>')
               .attr('class','yts-list');

            // div containing image + caption
            var wrapperDiv = $('<div>')
               .attr('class','yts-photo-wrapper');

            // image source tag
            var imgTag = $('<img>')
               .attr('class','yts-photo')
               .attr('src', vids[key].snippet.thumbnails.medium.url);

            // floating image label
            var imgLabel = $('<div>')
               .attr('class','yts-caption')
               .html(vids[key].snippet.title);

            wrapperDiv.append(imgTag);
            wrapperDiv.append(imgLabel);
            imgContainer.append(wrapperDiv);

            imgContainer.appendTo('#stuff');
            // $('#stuff').append(vids[key].snippet.thumbnails.high.url + '<br>');

         }
      },

      //----------------------------------------------------------------------------------
      //    displayVideos
      //
      //----------------------------------------------------------------------------------
      getVideos: function(searchTerm, maxResults) {
         // we'll need this refernce later inside the $.ajax scope
         var _this = this;

         var requestBody = {
            type:    "GET",
            url:  this.baseURL +
                  "search?part=snippet&" +
                  "&q="+ searchTerm +
                  "maxResults="+maxResults +
                  "&key="+this.apiKey,
            async: false
         };// End requestBody

         console.log(url);

         $.ajax(requestBody).done(function(data, status) {
            if (status === 'success') {
               if (data) {
                  console.log(data);
                  _this.videosList = data.items;
                  return true;
               }
            }
            else {
               alert("No videos found :(");
               return false;
            }
         });//End $.ajax
      }// End getVideos

   }// End object YouTubeSearch

   window.yts = YouTubeSearch;

   // grab JSON api data, then display
   $.when(YouTubeSearch.getPlaylistVideos("PLLtM6mCpibb87Ee_bbDB11MXyDmjxh2e4", 30))
      .done(YouTubeSearch.displayVideos());
*/
   // grab JSON api data, then display
   /*$.when(YouTubeSearch.getVideos("Dilated", 30))
      .done(YouTubeSearch.displayVideos()); */

});// End on Document Load
