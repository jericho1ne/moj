/**
 * @file Events.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2016 Middle of June.  All rights reserved.
 *
 * Everything needed to get Events and Artist info
 */

var Events = {
    // PROPERTIES
    dataFolder: 'data/',
    eventsJSON: 'events.json',

    apiScriptsBase: 'scripts/api/',
    eventsScript: 'getEventsJson.php',

    $eventData: {},
    maxVideosToShow: 4,

    /**
     * getEventData
     * returns the data table object in its current state
     */
    getEventData: function() {
        return this.$eventData;
    },// End getEventData

    /**
     * getEvents
     * list of events, bounded by certain input parameters
     */
    getEvents: function(maxResults) {
        // TODO:  limit on maxResults
        var _this = this;

        // $.ajax method will call resolve() on the deferred it returns
        // when the request completes successfully
        return $.ajax({
                type: 'GET',
                url: _this.apiScriptsBase + _this.eventsScript,
                async: false,
                // Success callback will fire even when coupled with an external $.done
                success : function(data) {  // data, status, jqXHR
                    // Save current artist data in global cache
                    CACHE['eventData'] = data;
                    return(data);
                },
                // if the request fails, deferred.reject() is called
                error : function(code, message){
                    // Handle error here
                    // TODO:  change to jquery UI modal that autofades and has (X) button
                    return Error("Unable to load Event data =(");
                }
        });// End getEvents $.ajax
    },// End getEvents

    /**
     * displayEvents
     * display events inside the div id we've passed in
     */
    displayEvents: function(data, divId) {
        if (data.success) {
            var events = data.events;
        }

        if (!events.length || typeof events === 'undefined') {
            return Error("displayEvents did not receive any data ='()");
        }
        else {
            /*  ----- events format ----
                ymd_date: "2016-01-31"
                nice_date: "Sunday Nov 1"
                short_date: "Sun Nov 1"
                title: "Hanson @ Fonda Theatre"
                type: "show"
                url: "http://www.thing.com/events/199123/event-tickets?refId=xxxxx"
                venue: "Fonda Theatre"
                artist: "Hanson"
                year: "2015"        */

            // clear div contents
            $('#' + divId).empty('');

            // Start building the datatable container

            // TODO:  if ever more than one datatable is present
            //          create a unique id for each
            //          eg, append + year + '-' + month;
            var dataTableUniqueID = 'data-table-01';

            // Create Datatable table tag, appending old school JS onClick
            // (for mobile browser compatibility)
                         
            var $dataTable = $('<table>')
                .attr('id', dataTableUniqueID)
                .addClass('display dataTable border');
                
            // Create Datatable header row
            var $tableHeader = $('<thead>')
                    .addClass('row-bold')
                    .html('<tr><th class="left event-date">date</th>'
                        + '<th class="left event-artist">artist</th>'
                        + '<th class="left event-venue">venue</th>'
                        + '<th class="left">tix</th>'
                        + '</tr>');


            // Append Datatable header row
            $dataTable.append($tableHeader);

            // Append table body tag (required by dataTables)
            $dataTable.append('<tbody>');

            // Initialize once, reuse inside upcoming loop
            var row = '';
            var rowCount = 0;
            var prevRawDate = '';
            
            // Loop through incoming data
            // $(eventsData).each(function() {
            for (var i in events) {
                 var dateArray = events[i].short_date.split(" ");

                if (prevRawDate !== events[i].ymd_date) {
                    var $dateHeaderRow = $('<tr>')
                        .html(
                            '<th class="date-header w100 text-align-right date-block-xl" data-sort="' + events[i].ymd_date + '">'
                                + dateArray[0] +'</th>'
                            + '<th class="date-header">'
                            + '<span class="text-align-left date-block-md">' + dateArray[1] + '</span><br>' 
                            + '<span class="text-align-left date-block-lg">' + dateArray[2] + '</span>'
                            +'</th>'
                            + '<th class="date-header"></th><th class="date-header"></th>');

                    // Append individual date header row
                    $dataTable.append($dateHeaderRow);
                    // displayDate += '&nbsp;';
                }

                // Date | Artist | Venue
                var $dataRow = $('<tr>')
                    .addClass('line-item' + (rowCount % 2 ? '' : ' alternate-bgcolor'))
                    .html('<td class="left" data-sort="' + events[i].ymd_date + '">'
                        + '<span class="opacity-30">' + events[i].short_date + '<span>'
                        + '</td>'  // ideally, embed ymd_date in a hidden *-data attrib

                        // For artist, use a highlighted bg color if a fave
                        // style="background-color:' + expenseCategories[row.label].color + '"
                        + '<td class="left">' 
                        + '<span class="link artistInfo" ' 
                        + 'data-url="' +  events[i].url + '" '
                        + 'data-artist="' + events[i].artist + '" '
                        + 'data-venue="' + events[i].venue + '" '
                        + '>' 
                        + events[i].artist + ''
                        + '</span></td>'
                        
                        + '<td class="left">' + events[i].venue + '</td>'
                        
                        + '<td class="left"><a href="' + events[i].url + '">' 
                        + '<i class="fa fa-ticket fa-4"></i>' + '</a></td>'
                        + '</tr>' );

                // Append individual event row
                $dataTable.append($dataRow);

                prevRawDate = events[i].ymd_date;
                rowCount ++;
            }
            // });// End eventsData.each
            
            $dataTable.append('</tbody>');

            // The final append to DOM
            $('#' + divId).append($dataTable);

            //
            //  Initialize DataTables
            //
            //setTimeout(function(){ 
                $('#' + dataTableUniqueID).DataTable({
                    "lengthMenu": [[20, 40, 160, 320, -1], [20, 40, 80, 160, 320, "All"]],
                    // 0 = date, 1 = artist, 2 = venue, 3 = ticket
                    "order": [[ 0, "asc" ]],
                    "aoColumnDefs": [
                        { 'bSortable': false, 'aTargets': [ 0, 1, 2, 3 ] }
                    ],
                    "autoWidth": true,
                    "language": {
                        "lengthMenu": "show _MENU_",
                        "sSearch": "search",
                        "zeroRecords": "Nothing found.",
                        "info": "",  // Default:  "Page _PAGE_ of _PAGES_",
                        "infoEmpty": "No records available",
                        "infoFiltered": ""
                    }
                });
            //}, 200);

            // Give the datatable a chance to complete attaching, then call it quits
            setTimeout(function() {
                // Save into class property
                //this.$eventData = $dataTable;
                return("Event data loaded");
            }, 0);
        }// End else data received
       
    },// End displayEvents

    //
    // Artist Bio, Info, Images, and Top tracks
    //
   

    /**
     * getArtistInfo :: gets bio, images, etc
     */
    getArtistInfo: function (artistName) {
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
                if (data.error !== 6) {
                    // Save current artist data in global cache
                    // CACHE[strToLowerNoSpaces(data.artist.name)] = data;
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
     * appendArtistInfo :: display artist info in DOM
     */
    appendArtistInfo: function (divId, data) {
        // Create and return a promise object
            // Figure out whether data is clean or not
        var noInfoOnArtist = (data.error === 6 ? true : false);
      
        // TODO: Check for existence of photo and bio separately

        // Display some placeholder text and image
        if (noInfoOnArtist) {
            console.log(" ERROR 6: No info on artist. ");

            $('#artist-photo').html('<div class="top60">'
                + '<img src="media/images/no-artist-photo.png" class="opacity-80" alt="no artist photo"</i></div>');

            $('#artist-bio').html(
                '<br><br><br>'
                + ' <i class="fa fa-terminal fa-2x"></i></div>'
                +'<div>Last.fm has no information on this artist.&nbsp;'
            );

            return Error("appendArtistInfo kinda sorta failed just now  ='()");
        }
        // Data is good, append it to the given selector
        else {
            // Create specific parent div name
            var artistInfo = '#' + divId;

            // Create custom info array
            var artist = {
                'name': data.artist.name,
                'bio': data.artist.bio,
                'url': data.artist.url,
                'images': data.artist.image,
                'tags': data.artist.tags.tag
            };

            // Arbitrary limit on how much biography text to show
            var maxCharsInBio = 600;

            // Remove any links
            var fullBio = data.artist.bio.content.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");

            // Clip bio at preset character max
            var shortBio = fullBio.substring(0, maxCharsInBio);
            
            // If longer than max amount, add "show more" link
            if (fullBio.length > maxCharsInBio) {
                shortBio += ' ... <span class="link">'
                    + '<a href="' + artist.url + '" target="_blank">( read more )</a>'
                    + '<span>';
            }

            // Clear existing content        
            $('#artist-photo').html();
            $('#artist-bio').html();
            $('#artist-tracks').html();

            // photoContainer = artist photo + name caption
            $photoCaption = $('<h3>')
                .addClass('photo-caption')
                .html(artist.name);

            // Set the img tag    
            $('#artist-photo').html('<img src="' + artist.images[3]['#text'] + '" class="artist-profile-pic">');
            $('#artist-photo').append($photoCaption);

            // Append the artist bio text
            $('#artist-bio').html(shortBio);
            
            //
            // TODO: loop through artist.tags.tag and print each tag in a button
            //
            
            // Promise resolution - pass along artist name
            return artist.name;
        }// End else
    },// End function appendArtistInfo

    /**
     * getTopTracks :: returns top 50 tracks by a given artist
     */
    getTopTracks: function (artistName) {
        // console.log(" >> 2) getTopTracks called (" + artistName + ')');
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
                // Cache track data to avoid future calls
                // CACHE[strToLowerNoSpaces(data.toptracks['@attr'].artist) + '_tracks'] = data;
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
     * appendTopTracks :: display artist's top tracks
     */
    appendTopTracks: function(divId, data) {
        // Keep an eye on this in case Last.fm changes their object structure
        var artistTracks = data.toptracks.track;
      
        // Clear current contents of div (shouldn't be any)
        $('#' + divId).empty();

        if (typeof artistTracks !== undefined && artistTracks.length) {
        
            // $('#' + divId).append('<h3>Tracklist</h3>');
            
            var $videoList = $('<ul>')
               .attr('class','vid-list');
            
            $('#' + divId).append($videoList);

            var searchString = '';

            // Create artist info element to be displayed
            for (i = 0; i < artistTracks.length; i++) { 
                // TODO:  create playlist of individual tracks via YouTube API hook
                var searchString = artistTracks[i].name + ' ' + artistTracks[i].artist.name;

                // Search for artist + track name one at a time
                // Limit to 1 result max since we're doing individual calls
                Events.searchYoutube(stripSpaces(searchString), 1);

                // Debug - See top track names pulled by Last.fm
                // $('#' + divId).append(song + ' / ');

                // Limit number of clips shown
                if ((i+1) >= this.maxVideosToShow) {
                    break;
                }
            }// End for loop through Artists' top tracks
        }// End if data
        else {
            console.log("appendTopTracks got no data :'(")
        }
    },// End function appendTopTracks

    /**
     * searchYoutube :: scour for videos based on search term
     */
    searchYoutube: function(searchTerm, maxResults) {
        var requestBody = {
            type: "GET",
            url:  YOUTUBE_BASE_URL +
                  "search?part=snippet" +
                  "&q=" + searchTerm +
                  "&key=" + YOUTUBE_API_KEY_NEW,
                  // "&maxResults=" + parseInt(maxResults),
            async: false
        };// End requestBody

        $.ajax(requestBody).done(function(data, status) {
            if (status === 'success') {
               if (data) {
                    //console.log(data.items);
                    //console.log("=====================================");
                    // Append video thumb to DOM
                    Events.appendYoutubeVideo('artist-tracks', data.items);
                    return true;
               }
            }// End if success
            else {
               alert("No videos found :(");
               return false;
            }// End if failure
        });//End $.ajax
    },// End searchYoutube

    /**
     * appendYoutubeVideo :: add video clip thumbs to DOM
     */
    appendYoutubeVideo: function(divID, vids) {   
        var videoId = vids[0].id.videoId;

        // vids[0].snippet.thumbnails.medium.url     // .width=320, height=180
        // vids[0].snippet.thumbnails.high.url       // .width=480, height=360
        // vids[0].snippet.thumbnails.default.url    // .width=120, height=90

        // div containing image + caption
        var $wrapperDiv = $('<li>')
           .attr('class','vid-clip-wrapper');

        // Image source tag
        // var imgTag = $('<img>')
           //.attr('class','vid-clip')
           //.attr('src', vids[0].snippet.thumbnails.medium.url);       
        
        // Embed Youtube video clip
        // Enable dynamic play/stop functionality:  ?version=3&enablejsapi=1 
        // if Flash <object> stops working switch to .html('<iframe frameborder="0" 

        var $imgTag = $('<div>')
            .attr('class','vid-clip')
            .html('<object id="' + videoId + '" data="http://www.youtube.com/embed/' 
                + videoId + '"></object>'); 

        // floating image label
        var $imgLabel = $('<div>')
           .attr('class','vid-caption')
           .html(vids[0].snippet.title);

        // Attach visual + label to the wrapper div
        $wrapperDiv.append($imgTag);
        $wrapperDiv.append($imgLabel);

        // Attach the group above to the ul list
        $('#' + divID + ' ul').append($wrapperDiv);
    },

}// End object Events
