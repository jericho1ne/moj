/*
 * Artist.js
 *
 **/

  var Artist = {
    // PROPERTIES
    tempArray: [],
    stringthing: 'home',
    maxVideosToShow: 3,

    // YOUTUBE PROPERTIES
    videosList: [],
    favoritesList: [],

    //
    // Artist Bio, Info, Images, and Top tracks
    //
    applyPaginationListeners: function($dataTable) {
        var __this = this;
        $('.paginate_button').click(function() {
            // Get venues within 25 miles, max 10 results
            __this.applyArtistListeners($dataTable);
        });
    },// End applyPaginationListeners

    applyArtistListeners: function($dataTable) {
        $dataTable.find('.artistInfo').on('click', function() {
            console.log( " artistInfo clicked ");
            // Same as using the more specific $(this).attr('data-val') 
            var artistName = $(this).html();  

            // Create div to hold modal contents
            var $artistPopup = $('<div>');

             // Initialize dialog box
            $artistPopup.load('templates/artist-popup.html').dialog({
                autoOpen: false,
                height: '600',
                width: '80%',
                modal: true,
                resizable: true,
                dialogClass: 'error-dialog',
                close: function(event, ui) {
                    $(this).dialog('destroy').remove();
                }
            });

            // Promise chain 
            //  - get artist info, display it, get top tracks, display them
            Artist.getArtistInfo(artistName)
                .then(function(artistData) {
                    Artist.appendArtistInfo('artist-info', artistData);
                });

            Artist.getTopTracks(artistName)
                .then(function(trackData) {
                    Artist.appendTopTracks('artist-tracks', trackData);
                });

            setTimeout(function(){
                // Pop up the info modal
                $artistPopup.dialog("open");
             }, 150);
            

        });// artistInfo .click
    }, // End setListeners

    /**
     * getArtistInfo :: gets bio, images, etc
     */
    getArtistInfo: function (artistName) {
        console.log(" >> 1) getArtistInfo called");
        // Get Artist Info
        //  http://www.last.fm/api/show/artist.getinfo
        // console.log(CACHE[strToLowerNoSpaces(artistName)]);
       
        //var promise = CACHE[strToLowerNoSpaces(artistName)];
        //if (!promise) {
        return $.ajax({
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
             
                if (data.error !== 6) {
                    // Save current artist data in global cache
                    CACHE[strToLowerNoSpaces(data.artist.name)] = data;
                }
                else {
                    console.log("no data on this artist...");
                    // TODO: fallback to another API
                }
            },
            error : function(code, message){
                // Handle error here
                // TODO:  change to jquery UI modal that autofades and has (X) button
                alert("Unable to load Artist data =(");
            }
        });// End artistXHR $.ajax 
    },// End getArtistInfo

    /**
     * getTopTracks :: returns top 50 tracks by a given artist
     */
    getTopTracks: function (artistName) {
        console.log(" >> 2) getTopTracks called");
        // Get Artist Top Tracks
        //   http://www.last.fm/api/show/artist.getTopTracks
        // var topTracksXHR = $.ajax({

        // return CACHE[strToLowerNoSpaces(artistName) + '_tracks' ] || 
        return $.ajax({
            type: 'POST',
            url: 'http://ws.audioscrobbler.com/2.0/',
            data: 'method=artist.getTopTracks&' +
                   'artist=' + artistName + '&' +
                   'limit=' + LASTFM_TOPTRACKS_LIMIT + '&' +
                   'api_key=' + LASTFM_API_KEY + '&' +
                   'format=json',
            dataType : 'json',
            // Success callback will fire even when couple with an external $.done
            success : function(data) {
                console.log(' >> topTracksXHR success >>');

                // Cache track data to avoid future calls
                CACHE[strToLowerNoSpaces(data.toptracks['@attr'].artist) + '_tracks'] = data;
            },
            error : function(errorCode, errorMsg) {
                // Handle error here
                // TODO:  change to jquery UI modal that autofades and has (X) button
                var msg = 'Unable to load Top tracks for <b>' + + '</b>';
                alert(msg + '<br>' + errorMsg + '(' + errorCode + ')');
            }
        });// End topTracksXHR $.ajax 
    },// End function getTopTracks

    /**
     * appendArtistInfo :: display artist info in DOM
     */
    appendArtistInfo: function (divId, data) {
        // Create specific parent div name
        var $artistInfo = $('#'+divId);

        // Create custom info array
        var artist = {
            'name': data.artist.name,
            'bio': data.artist.bio,
            'url': data.artist.url,
            'images': data.artist.image,
            'tags': data.artist.tags.tag
        };

        var maxChars = 800;

        // Remove any links
        var fullBio = data.artist.bio.content.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");

        // Clip bio at preset character max
        var shortBio = fullBio.substring(0, maxChars);
        
        // If longer than max amount, add "show more" link
        if (fullBio.length > maxChars) {
            shortBio += ' ... <a href="#">( read on )</a>';
        }

        // Clear existing content        
        $('#artist-photo', $artistInfo).html();
        $('#artist-bio', $artistInfo).html();
        $('#artist-tracks', $artistInfo).html();

        // photoContainer = img + caption
        $photoCaption = $('<h3>')
            .addClass('photo-caption')
            .html(artist.name);

        $('#artist-photo', $artistInfo).html('<img src="' + artist.images[3]['#text'] + '" class="artist-profile-pic">');
        $('#artist-photo', $artistInfo).append($photoCaption);

        // Artist bio text
        $('#artist-bio', $artistInfo).html(shortBio);

        // $artistLeftDiv.append($photoContainer);
        // $artistRightDiv.append($bio);
 
        // $('#' + divId)
        //     .append($artistLeftDiv)
        //     .append($artistRightDiv);
    },// End function appendArtistInfo

    /**
     * appendTopTracks :: display artist's top tracks
     */
    appendTopTracks: function(divId, data) {
        var topTracks = data.toptracks.track;
        var topTracksLength = topTracks.length;

        $('#' + divId).empty();
        // $('#' + divId).append('<h3>Tracklist</h3>');

        // Create artist info element to be displayed
        for (i = 0; i < topTracksLength; i++) { 
            // TODO:  create playlist of individual tracks via YouTube API hook
            var song = topTracks[i].name;
            var artist = topTracks[i].artist.name;

            // Search for artist + track name one at a time, 1 max result
            Artist.searchYoutube(stripSpaces(artist + ' ' + song), 1);

            // Debug - See top track names pulled by Last.fm
            // $('#' + divId).append(song + ' / ');

            if ((i+1) >= this.maxVideosToShow) {
                break;
            }
        }// End for loop
       
    },// End function appendTopTracks

    searchYoutube: function(searchTerm, maxResults) {
         console.log(searchTerm);

         var requestBody = {
            type: "GET",
            url:  YOUTUBE_BASE_URL +
                  "search?part=snippet" +
                  "&q=" + searchTerm +
                  "&key=" + YOUTUBE_API_KEY +
                  "&maxResults=" + parseInt(maxResults),
            async: false
         };// End requestBody

         $.ajax(requestBody).done(function(data, status) {
            if (status === 'success') {
               if (data) {
                  // Append video thumb to DOM
                  Artist.appendYoutubeVideo('artist-tracks', data.items);
                  return true;
               }
            }
            else {
               alert("No videos found :(");
               return false;
            }
         });//End $.ajax
    },// End searchYoutube

    appendYoutubeVideo: function(divID, vids) {
        console.log(' >> displayVideos >> ');
        console.log(divID);
        console.log(vids);
        window.data = vids;
      
         // vids[0].id
            // vids[0].snippet.thumbnails.title
            // vids[0].snippet.thumbnails.medium.url     // .width=320, height=180
            // vids[0].snippet.thumbnails.high.url          // .width=480, height=360
            // vids[0].snippet.thumbnails.default.url      // .width=120, height=90

            var imgContainer = $('<li>')
               .attr('class','yts-list');

            // div containing image + caption
            var wrapperDiv = $('<div>')
               .attr('class','yts-photo-wrapper');

            // image source tag
            var imgTag = $('<img>')
               .attr('class','yts-photo')
               .attr('src', vids[0].snippet.thumbnails.medium.url);       

            // floating image label
            var imgLabel = $('<div>')
               .attr('class','yts-caption')
               .html(vids[0].snippet.title);

            wrapperDiv.append(imgTag);
            wrapperDiv.append(imgLabel);
            imgContainer.append(wrapperDiv);

            window.imgContainer = imgContainer;
            console.log(" APPENDING NOW >>>>> ");
            console.log(vids[0]);
            $('#' + divID).append(imgContainer);

    },
  };// End object UserState
