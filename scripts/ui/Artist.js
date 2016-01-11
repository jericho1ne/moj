/*
 * Artist.js
 *
 **/

  var Artist = {
    // PROPERTIES
    tempArray: [],
    stringthing: 'home',

    //
    // Artist Bio, Info, Images, and Top tracks
    //

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
                // Save current artist data in global cache
                CACHE[strToLowerNoSpaces(data.artist.name)] = data;
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

        $('#' + divId).empty();

        // Create artist info element to be displayed
        $info = $('<span>')
            .html('<h3>' + artist.name + '</h3>' + shortBio + 
                '<br><br>' + '<img src="' + artist.images[2]['#text'] + '">');
        $('#' + divId).append($info);
    },// End function appendArtistInfo

    /**
     * appendTopTracks :: display artist's top tracks
     */
    appendTopTracks: function(divId, data) {
        var topTracks = data.toptracks.track;

        $('#' + divId).empty();
        $('#' + divId).append('<h3>Tracklist</h3>');

        // Create artist info element to be displayed
        for (i = 0, len = topTracks.length; i < len; i++) { 
            // TODO:  create playlist of individual tracks via YouTube API hook
            $song = $('<li>')
                .addClass('youtube-clip')
                .html(topTracks[i].name);

            $('#' + divId).append($song);
        }// End for loop
       
    },// End function appendTopTracks

  };// End object UserState
