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
      displayVideos: function(divID) {
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

            $('#' + divID).append(imgContainer);
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
