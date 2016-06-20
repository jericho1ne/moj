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

    eventData: {},
    maxVideosToShow: 5,

    /**
     * getEventData
     * returns the data table object in its current state
     */
    getEventData: function() {
        return this.eventData;
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


    getEventByKeyValue: function(key, value) {
        // console.log(' >> getEventByKeyValue ' + key + '||' + value);
        if (!isEmpty(key) && !isEmpty(value)) {
            for (var i=0; i< this.eventData.length; i++) {
                if (this.eventData[i][key] == value) {
                    return this.eventData[i];
                }
            }// End for events loop
        }
        return false;
    },// End getEventByKeyValue

    getEventByIndex: function(arrayIndex) {
        return this.eventData[arrayIndex];
    },// End getEventById

    /**
     * displayEvents
     * display events inside the div id we've passed in
     */
    displayEvents: function(events, divId) {
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
            .addClass('display dataTable');
            
        // Create Datatable header row (HIDDEN)
        var $tableHeader = $('<thead>')
                .addClass('row-bold')
                .html('<tr>'
                    // 1st header column
                    + '<th class="left"></th>'
                    // 2nd header column
                    + '<th class="left"></th>'
                    // 3rd header column
                    //+ '<th class="left"></th>'
                    + '</tr>');

        // Append Datatable header row
        $dataTable.append($tableHeader);

        // Append table body tag (required by dataTables)
        $dataTable.append('<tbody>');

        // Initialize once, reuse inside upcoming loop
        var row = '';
        var rowCount = 0;
        var prevDate = '';
        
        // Loop through incoming data
        for (var i in events) {
            // simplify var names
            var event_id = events[i].event_id;
            var nice_date = events[i].nice_date;              
            var ymd_date = events[i].ymd_date;
            var artist = events[i].artist;
            var venue = events[i].venue;
            var title = events[i].title;
            var type = events[i].type;
            var price = events[i].price;
            var url = events[i].url;

            // Do date stuff
            var dateArray = nice_date.split(" ");
            var weekday = dateArray[0];
            var month = dateArray[1];
            var dayofmonth = dateArray[2];

            // If the date has changed, it's time for the spacer row with large text
            if (String(prevDate.trim()) != String(ymd_date.trim())) {
                
                // Create new date row
                var $dateHeaderRow = $('<tr>')
                    .addClass('date-header-row')
                    .html(
                        // 1st header row - keep data-sort attribute!
                        '<th mw200 class="date-header" data-sort="' + ymd_date + '">'
                        +   '<span class="date-block-xl white">' + weekday + '</span>'
                        +   '<span class="align-left date-block-md off-white opacity-60">' 
                            + month + '</span><br>' 
                        +   '<span class="align-left date-block-md off-white opacity-60">' 
                            + dayofmonth + '</span>'
                        + '</th>'
                        // 2nd header row
                        + '<th class="date-header"></th>' 
                        // 3rd header row
                        //+ '<th class="date-header"></th>'
                        );

                // Append individual date header row
                $dataTable.append($dateHeaderRow);
            }// End if new date row is to be display

            // Set title based on source and content
            // Default to artist name, just in case the rest is blank
            var eventTitle = artist;
         
            // Experience LA often has the artist and title set to the same damn thing
            // or, they have no Artist set
            if (artist.trim() === title.trim() || 
                artist === '') {
                eventTitle = title;
            }
            

            // Date | Artist | Venue
            var $dataRow = $('<tr>')
                .addClass('line-item')
                .html(
                    // For artist, use a highlighted bg color if a fave
                    
                    // 1st column :: Artist + Venue
                    '<td class="left" data-sort="' + ymd_date + '">' 
                    +   '<span class="link artistInfo" ' 
                    +       'data-eventid="' + i + '" '
                    +       'data-url="' + url + '" '
                    +       'data-artist="' + eventTitle + '" '
                    +       'data-venue="' + venue + '" '
                    +       'data-nicedate="' + nice_date + '" '
                    +   '>' 
                    +       eventTitle + ''
                    +   '</span>'
                    +   '<span class="small-text block pad-top-4 pad-left-6">' + venue + '</td>'
                    + '</td>'
                    
                    // 2nd column :: Venue
                    // + '<td class="left small-text">' + venue + '</td>'
                    
                    // 3rd column :: Ticket link
                    + '<td class="left w60"><a href="' + url + '">' 
                    +   '<img src="media/svg/ticket.svg" class="icon-link" alt="Get tickets" />' + '</a>'
                    + '</td>'

                + '</tr>' );

            // Append individual event row
            $dataTable.append($dataRow);

            prevDate = ymd_date;
            rowCount ++;
        }

        // End the table body            
        $dataTable.append('</tbody>');

        // The final append to DOM
        $('#' + divId).append($dataTable);

        //
        //  Initialize DataTables
        //
        $('#' + dataTableUniqueID).DataTable({
            "bPaginate": true,
            "pagingType": "simple",      // Prev and Next buttons only 
            "pageLength": DATATABLES_PAGE_LENGTH, 
            "lengthChange": false,
            //  "lengthMenu": [[10, 20, 40, -1], [10, 20, 40, "All"]],
            "dom": '<"top"ifl<"clear">>rt<"bottom"p<"clear">>',
            
            // Alternating row color
            "asStripeClasses": [ 'even-bgcolor', 'odd-bgcolor' ],
            
            "order": [[ 0, "asc" ]],
            "aoColumnDefs": [
                // 0 = date, 1 = artist, 2 = venue, 3 = ticket
                { 'bSortable': false, 'aTargets': [ 0, 1 ] }
            ],
            "autoWidth": false,
            "language": {
                //  "lengthMenu": "_MENU_ per pg",
                "sSearch": "search by Artist or Venue",        // Search input box label
                "zeroRecords": "Nothing found.",
                "info": "",  // Default:  "Page _PAGE_ of _PAGES_",
                "infoEmpty": "No shows available",
                "infoFiltered": ""
            }
        });
  
        // Give the datatable a chance to complete attaching
        setTimeout(function() {
            // Save into class property
            //this.eventData = $dataTable;
            function leftArrowPressed() {
                $('.paginate_button.previous').click()
            }
            function rightArrowPressed() {
                $('.paginate_button.next').click()
            }
            // Left/Right arrow page navigation
            document.onkeydown = function(evt) {
                evt = evt || window.event;
                switch (evt.keyCode) {
                    case 37:
                        leftArrowPressed();
                        break;
                    case 39:
                        rightArrowPressed();
                        break;
                }
            };// End L/R arrow nav

            // return("Event data loaded");
        }, 250);// End setTimeout for key listeners
       
    },// End displayEvents

    //
    // Artist Bio, Info, Images, and Top tracks
    //
   

    /**
     * getArtistInfo :: gets bio, images, etc
     */
    getArtistInfo: function (artistName, method) {

        if (typeof method !== 'undefined' || typeof method !== '') {
            // getinfo (confident search), 
            method = 'artist.' + method; 
        }
        // fall back on basic search
        else {
            method = 'artist.search';
        }
    
        // Get Artist Info
        //  http://www.last.fm/api/show/artist.getinfo OR artist.search
        // console.log(CACHE[strToLowerNoSpaces(artistName)]);
        
        // First, format the artist name so last.fm call doesn't fail
        var returnedName = cleanArtistName(artistName);

        var formattedArtistName = returnedName;

        if ($.isArray(returnedName)) {
            formattedArtistName = returnedName[1];
        }

        // Prepare full query url
        var baseUrl = 'http://ws.audioscrobbler.com/2.0/?';

        var httpGetVars = 'method=' + method + '&' +
                   'artist=' + formattedArtistName + '&' +
                   'api_key=' + LASTFM_API_KEY + '&' +
                   'format=json';

        // console.log(baseUrl + httpGetVars);

        //var promise = CACHE[strToLowerNoSpaces(artistName)];
        return $.ajax({
            type: 'POST',
            url: baseUrl,
            data: httpGetVars,
            dataType : 'json',
            // Success callback will fire even when couple with an external $.done
            success : function(data) {            
                if (data.error !== 6) {
                    // Save current artist data in global cache
                    // CACHE[strToLowerNoSpaces(data.artist.name)] = data;
                }
                else {
                    console.log(" (x) No data from Last.fm");
                    // TODO: fallback to another API
                }
            },
            error : function(code, message){
                // Handle error here
                // TODO:  change to jquery UI modal that autofades and has (X) button
                alert('Unable to load Artist data =( ' 
                    + 'Please check your internet connection');
            }
        });// End artistXHR $.ajax 
    },// End getArtistInfo

    /**
     * displayStaticShowInfo ::
     */
    displayStaticShowInfo: function (divId, event) {
        window.staticInfo = event;
        // Create specific parent div name
        var artistInfo = '#' + divId;

        // Display artist/show photo
        if (!isEmpty(event.media)) {
            // Set the img tag    
            $('#artist-photo').addClass('relative');
            $('#artist-photo').html('<a href="' + event.url + '">' 
                + '<img src="' + event.media + '" class="artist-profile-pic "></a>');
        }
        // Display placeholder text and image
        else {
            $('#artist-photo').html('<div class="top60">'
                + '<img src="media/images/no-artist-photo.jpg" class="artist-profile-pic" alt="No artist photo available" title="No artist photo available">'
                + '</div>');
        }


        // Artist photo + name caption
        if (!isEmpty(event.artist)) {
            $photoCaption = $('<span>')
                .addClass('photo-caption absolute')
                .html(event.artist);
            // $('#artist-photo').append($photoCaption);  
        }

        $('#artist-bio').empty();        // MOVE THIS TO MODAL RESET METHOD

        // Event Description
        if (!isEmpty(event.description)) {
            // Arbitrary limit on how much biography text to show
            var maxCharsInBio = 450;

            // Remove any links
            var fullBio = event.description.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");
            // Clip bio at preset character max
            var shortBio = fullBio.substring(0, maxCharsInBio);
            // If longer than max amount, add "show more" link
            if (fullBio.length > maxCharsInBio) {
                shortBio += ' <span class="link">'
                    + '<a href="' + event.url + '" target="_blank">( read more )</a>'
                    + '<span>';
            }
            
            // Append the artist bio text
            $('#artist-bio').html(shortBio);
        }// End if bio is not blank

        // Clear out the loading spinner since we won't be pulling youtube track
        $('#artist-tracks').empty();
       
            
        //
        // TODO: loop through event categories and print each tag in a button
        //      HERE instead of main.js...
        //
    },// End function displayStaticShowInfo

    /**
     * appendArtistInfo :: display artist info in DOM
     */
    appendArtistInfo: function (divId, data) {
        // In case of getinfo direct API call, data.error may exist
        var noInfoOnArtist = (data.error === 6) ? true : false;

        // If using the search API call, grab first artist in array
        if (typeof data.artist === 'undefined') {
            if (typeof data.results.artistmatches.artist[0] === 'undefined') {
                noInfoOnArtist = true;
            }
            else {
                artist = data.results.artistmatches.artist[0];
            }
        }// End if coming from a "search" API call
        else {
            // if ()
            artist = data.artist;
        }

        // DEBUG
        window.data = artist;        

        // Display some placeholder text and image
        if (noInfoOnArtist) {
            console.log(" ERROR 6: No info on artist. ");

            $('#artist-photo').html('<div class="top60">'
                + '<img src="media/images/no-artist-photo.jpg" class="artist-profile-pic" alt="No artist photo available"</i></div>');

            var msg = '<div>No info found on this artist.&nbsp;</div>'
            $('#artist-bio').empty();

            //return Error("appendArtistInfo kinda sorta failed just now  ='()");
        }
        // Data is potentially good, check futher for blanks
        else {
            // Fallbacks in case we haven't received the extraneous info 
            var artistBio = (typeof artist.bio !== 'undefined' ? artist.bio.content.trim() : '');
            var artistTags = (typeof artist.tags !== 'undefined' ? artist.tags.tag : '');
            var artistPhoto = (typeof artist.image 
                ? !isBlank(artist.image[3]['#text']) ? artist.image[3]['#text'] : ''
                : '');
            var noBio = (artistBio === '' ? true : false);
            var noPhoto = (artistPhoto === '' ? true : false);

            // Create specific parent div name
            var artistInfo = '#' + divId;
            
            // Create custom info array
            var artist = {
                'name': artist.name,
                'bio': artistBio,
                'url': artist.url,
                'images': artist.image,
                'tags': artistTags
            };

            $('#artist-bio').empty();        // MOVE THIS TO MODAL RESET METHOD

            // Bio exists, append content to modal
            if (!noBio) {
                // Arbitrary limit on how much biography text to show
                var maxCharsInBio = 450;
                // Remove any links
                var fullBio = artistBio.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");
                // Clip bio at preset character max
                var shortBio = fullBio.substring(0, maxCharsInBio);
                // If longer than max amount, add "show more" link
                if (fullBio.length > maxCharsInBio) {
                    shortBio += ' ... <span class="link">'
                        + '<a href="' + artist.url + '" target="_blank">( read more )</a>'
                        + '<span>';
                }
                // Append the artist bio text
                $('#artist-bio').html(shortBio);
            }// If case for bio content

            // No artist photo. Show De La Soul is Dead cover =)
            if (noPhoto) {
                 $('#artist-photo').html('<div class="top60">'
                    + '<img src="media/images/no-artist-photo.jpg" class="artist-profile-pic" alt="No artist photo available"</i></div>');
            }
            // Append artist photo
            else {
                // photoContainer = artist photo + name caption
                $photoCaption = $('<span>')
                    .addClass('photo-caption absolute')
                    .html(artist.name);

                // Set the img tag    
                $('#artist-photo').addClass('relative');
                $('#artist-photo').html('<a href="' + artist.url + '">'
                    + '<img src="' + artistPhoto + '" class="artist-profile-pic "></a>');

                // $('#artist-photo').append($photoCaption);  
            }// End artist photo exists
           
            // NECESSARY ??
            $('#artist-tracks').html();
            
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
                console.log(msg + '<br>' + errorMsg + '(' + errorCode + ')');
            }
        });// End topTracksXHR $.ajax 
    },// End function getTopTracks

    /**
     * appendTopTracks :: display artist's top tracks
     */
    appendTopTracks: function(divId, data) {
        // Clear current contents of div (shouldn't be any)
        $('#' + divId).empty();

        // If actual track data was returned
        if (data.error !== 6) {
            // Keep an eye on this in case Last.fm changes their object structure
            var artistTracks = $.map(data.toptracks.track, function( value, key ) {
                return {
                    'name': data.toptracks.track[key].name,
                    'artist': data.toptracks.track[key].artist.name
                };
            });
            
            // If tracks available
            if (typeof artistTracks !== undefined && artistTracks.length) {
                                
                var $videoList = $('<ul>')
                   .attr('class','vid-list');
                
                $('#' + divId).append($videoList);

                var searchString = '';

                // Create artist info element to be displayed
                for (i = 0; i < artistTracks.length; i++) { 

                    // TODO:  create playlist of individual tracks via YouTube API hook
                    var searchString = artistTracks[i].name + ' ' + artistTracks[i].artist;

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
        }
        else {
            console.log("appendTopTracks got no data :'(")
        }
    },// End function appendTopTracks

    /**
     * searchYoutube :: scour for videos based on search term
     */
    searchYoutube: function(searchTerm, maxResults) {
        var requestBody = {
            type: 'GET',
            url:  YOUTUBE_BASE_URL +
                  'search?part=snippet' +
                  '&q=' + searchTerm +
                  '&key=' + YOUTUBE_API_KEY_NEW +
                  '&maxResults=' + parseInt(maxResults),
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

        var $imgTag = $('<object>')
            .attr('class','vid-clip')
            .attr('id', videoId)
            // Embed video at specific quality by appending "vq="
            // 144p: &vq=tiny 
            // 240p: &vq=small 
            // 360p: &vq=medium 
            // 480p: &vq=large 
            // 720p: &vq=hd720 
            .attr('data', 'http://www.youtube.com/embed/' + videoId + '?vq=small');
            //    + videoId + '"></object>'); )
           //.html('<object id="' + videoId + '" data="http://www.youtube.com/embed/' 
            //    + videoId + '"></object>'); 

        // floating image label
        var $imgLabel = $('<div>')
           .attr('class','vid-caption')
           .html(vids[0].snippet.title);

        // Attach visual + label to the wrapper div
        $wrapperDiv.append($imgTag);
        $wrapperDiv.append($imgLabel);

        // Attach the group above to the ul list
        $('#' + divID + ' ul').append($wrapperDiv);
    },// End apppendYoutubeVideo

    /**
     * Convert the shorthand JSON data array keys to be more readable
     * @param  array data Shorthand-keyed Event Data
     * @return array Human-readable version
     */
    remapEventArrayKeys: function(data) {
         // Re-map array keys 
        var newData = [];

        // Time to remap array keys!
        for (var i in data) {
            newData.push({
                'event_id': data[i].e_id,
                'source': data[i].src,
                'nice_date': data[i].d_fmt,
                'ymd_date': data[i].d_ymd,
                'artist': data[i].a,
                'venue': data[i].v,
                'title': data[i].t,
                'slug': data[i].s,
                'type': data[i].typ,
                'price': data[i].prc,
                'url': data[i].url,
            });
        }// End for loop mapping array keys
        return newData;
    },// End remapEventArrayKeys

}// End object Events
