/*
* Events.js
*
**/
var Events = {
    // PROPERTIES
    dataFolder: 'data/',
    eventsJSON: 'events.json',

    apiScriptsBase: 'scripts/api/',
    eventsScript: 'getEvents.php',

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
     * displayEvents
     * display events inside the div id we've passed in
     */
    displayEvents: function(data, divId) {
        // Create the deferred object ourselves
        // var deferred = $.Deferred();

        /*  ----- data format ----
            date: "1446361200000"
            fmt_date: "2015-11-01"
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
        // var $dataTableParent = $('<div>')
        //     .addClass("normal-pad");

        // TODO:  if ever more than one datatable is present
        //          create a unique id for each
        //          eg, append + year + '-' + month;
        var dataTableUniqueID = 'data-table-01';

        // Create Datatable table tag
        var $dataTable = $('<table>')
            .attr('id', dataTableUniqueID)
            .addClass('display container dataTable border');

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

        $dataTable.append('<tbody>');

        // Initialize once, reuse inside upcoming loop
        var row = '';
        var rowCount = 0;
        var prevRawDate = '';
        
        // Loop through incoming data
        // $(eventsData).each(function() {
        for (var i in data) {
            // DEBUG
            // if (rowCount > 100) break;

            var dateArray = data[i].short_date.split(" ");

            if (prevRawDate !== data[i].raw_date) {
                var $dateHeaderRow = $('<tr>')
                    .html(
                        '<th class="date-header w100 text-align-right date-block-xl" data-sort="' + data[i].raw_date + '">'
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
                .html('<td class="left" data-sort="' + data[i].raw_date + '">'
                    + '<span class="opacity-30">' + data[i].short_date + '<span>'
                    + '</td>'  // ideally, embed fmt_date in a hidden *-data attrib

                    // For artist, use a highlighted bg color if a fave
                    // style="background-color:' + expenseCategories[row.label].color + '"
                    + '<td class="left"><span class="link artistInfo">' + data[i].artist + '</span></td>'
                    
                    + '<td class="left">' + data[i].venue + '</td>'
                    
                    + '<td class="left"><a href="' + data[i].url + '">' 
                    + '<i class="fa fa-ticket fa-4"></i>' + '</a></td>'
                    + '</tr>' );

            // Append individual event row
            $dataTable.append($dataRow);

            prevRawDate = data[i].raw_date;
            rowCount ++;
        }
        // });// End eventsData.each
        
        $dataTable.append('</tbody>');

        // The final append to DOM
        $('#' + divId).append($dataTable);

        //
        //  Initialize DataTables
        //
        setTimeout(function(){ 
            $('#' + dataTableUniqueID).DataTable({
                "lengthMenu": [[20, 40, 160, 320, -1], [20, 40, 80, 160, 320, "All"]],
                // 0 = date, 1 = artist, 2 = venue, 3 = ticket
                "order": [[ 0, "asc" ]],
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [ 0, 1, 2, 3 ] }
                ],
                "autoWidth": true,
                "language": {
                    "lengthMenu": "_MENU_ events per page",
                    "zeroRecords": "Nothing found.",
                    "info": "",  // "Page _PAGE_ of _PAGES_",
                    "infoEmpty": "No records available",
                    "infoFiltered": ""
                }
            });
        }, 200);

        // Give the datatable a chance to complete attaching, then call it quits
        setTimeout(function() {
            //deferred.resolve();
        }, 600);
       
        // Save into class property
        //this.$eventData = $dataTable;
        // Always return deferred object regardless
        //return deferred.promise();
    },// End displayEvents
    /**
     * getEvents
     * list of events, bounded by certain input parameters
     */
    getEvents: function(maxResults) {
        // $.ajax method will call resolve() on the deferred it returns
        // when the request completes successfully
        return $.ajax({
            type: 'GET',
            url: this.apiScriptsBase + this.eventsScript,
            async: false,
            // Success callback will fire even when coupled with an external $.done
            success : function(data) {  // data, status, jqXHR
                // console.log(' >> events XHR success >>');
                // Save current artist data in global cache
                CACHE['eventData'] = data;
            },
            // if the request fails, deferred.reject() is called
            error : function(code, message){
                // Handle error here
                // TODO:  change to jquery UI modal that autofades and has (X) button
                alert("Unable to load Event data =(");
            }
        });// End getEvents $.ajax 
    },// End getEvents

    //
    // Artist Bio, Info, Images, and Top tracks
    //
    applyPaginationListeners: function() {
        var __this = this;

        // Replacement for .live()
        $(document).on('click', '.paginate_button', function() {  
            // Get venues within 25 miles, max 10 results
            __this.applyArtistListeners();
        });
    },// End applyPaginationListeners

    applyArtistListeners: function() {
        console.log( " (+) applyArtistListeners called!");


        // .live() replacement;  used to be $('.dataTables_wrapper').find('.artistInfo').on('click', function() {
        $(document).on("click", '.artistInfo', function() {
            // Pull artist name from the link that was clicked
            // Same as using the more specific $(this).attr('data-val') 
            
            var artistName = $(this).html();  

            // Create div to hold modal contents
            var $artistPopup = $('<div>');

                         // Initialize dialog box
            $artistPopup.dialog({
                autoOpen: false,
                modal: true,
                resizable: true,
                dialogClass: 'info-dialog',
                close: function(event, ui) {
                    $(this).dialog('destroy').remove();
                }
            });
            $artistPopup.load('templates/artist-popup.html');
            
            // Pop up the info modal
            $artistPopup.dialog("open");

            // Switch to $(document) if this stops firing
            $('.ui-dialog').on('click', '#closeModalBtn', function() {
                // Fade out modal
                $artistPopup.fadeOut( "fast", function() {
                    // Completely destroy modal
                    $artistPopup.dialog('close');
                }); 
            });


            // Delay Promise chain until dialog is popped open!
            setTimeout(function(){
                //  - get artist info, display it, get top tracks, display them
                Events.getArtistInfo(artistName)
                    .then(function(artistData) {
                        return $.when(Events.appendArtistInfo('artist-info', artistData));
                    })
                    .then(function(artistName) {
                        Events.getTopTracks(artistName)
                    })                
                    .then(function(trackData) {
                        Events.appendTopTracks('artist-tracks', trackData);
                    })
            }, 550);
            

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
                window.artistData = data;
                console.log(' >> artistXHR success >>');
             
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
     * appendArtistInfo :: display artist info in DOM
     */
    appendArtistInfo: function (divId, data) {
        

        var noInfoOnArtist = false;
        if (data.error === 6) {
            console.log(" ERROR 6: No info on artist. ");
            noInfoOnArtist = true;
        }

        // Create specific parent div name
        var artistInfo = '#' + divId;

        if (noInfoOnArtist) {
            $('#artist-photo').html('<div class="top60">No Photo found &nbsp;<i class="fa fa-terminal"></i></div>');
            $('#artist-bio').html('<div class="top60">No Artist bio either &nbsp;<i class="fa fa-thumbs-o-down fa-2x"></i></div>');
        }// End if no info found on this artist
        else {
            // Create custom info array
            var artist = {
                'name': data.artist.name,
                'bio': data.artist.bio,
                'url': data.artist.url,
                'images': data.artist.image,
                'tags': data.artist.tags.tag
            };

            var maxChars = 600;

            // Remove any links
            var fullBio = data.artist.bio.content.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");

            // Clip bio at preset character max
            var shortBio = fullBio.substring(0, maxChars);
            
            // If longer than max amount, add "show more" link
            if (fullBio.length > maxChars) {
                shortBio += ' ... <span class="link">'
                    + '<a href="' + artist.url + '" target="_blank">( read more )</a>'
                    + '<span>';
            }

            // Clear existing content        
            //$('#artist-photo').html();
            //$('#artist-bio').html();
            //$('#artist-tracks').html();

            // photoContainer = img + caption
            $photoCaption = $('<h3>')
                .addClass('photo-caption')
                .html(artist.name);

                
            $('#artist-photo').html('<img src="' + artist.images[3]['#text'] + '" class="artist-profile-pic">');
            $('#artist-photo').append($photoCaption);

            // Artist bio text
            $('#artist-bio').html(shortBio);

            
            // TODO: loop through artist.tags.tag and print each tag in a button stylee

        }// End else we have info to display
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
            Events.searchYoutube(stripSpaces(artist + ' ' + song), this.maxVideosToShow);

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
               .attr('class','vid-list');

            // div containing image + caption
            var wrapperDiv = $('<div>')
               .attr('class','vid-photo-wrapper');

            // image source tag
            var imgTag = $('<img>')
               .attr('class','vid-photo')
               .attr('src', vids[0].snippet.thumbnails.medium.url);       

            // floating image label
            var imgLabel = $('<div>')
               .attr('class','vid-caption')
               .html(vids[0].snippet.title);

            wrapperDiv.append(imgTag);
            wrapperDiv.append(imgLabel);
            imgContainer.append(wrapperDiv);

            window.imgContainer = imgContainer;
          
            // console.log(vids[0]);
            $('#' + divID).append(imgContainer);

    },

}// End object Events
