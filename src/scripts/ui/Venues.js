/*
 * Venues.js
 *
 **/

var Venues = {
    // PROPERTIES
    // apiKey: "AIzaSyCF4m5XE3VTOUzo8b10EstraU1depENiB4",
    getShowsByVenue: 'scripts/api/getShowsByVenue.php',
    getShowsByVenueAndDistance: 'scripts/api/getShowsByVenueAndDistance.php',
    venuesList: [],

    /**
     * getShows
     * list of shows by venue, ordered by distance if lat/lon provided
     * options = { maxResults, coords (lat/lon), maxDistance }
     */
    getShows: function(options) {
        // Always set a default for maxResults limiter
        if (typeof options.maxResults === 'undefined') {
            options.maxResults = 10;
        }

        // Default to using the most basic query
        var postData = {
            'maxResults': options.maxResults
        };

        // If extra params passed in for geolocation query
        if (typeof options.coords !== 'undefined' ||
            typeof options.maxDistance !== 'undefined'
        ) {
            postData.lat = options.coords.lat;
            postData.lon = options.coords.lon;
            postData.maxDistance = options.maxDistance;
        } // End append params for geolocation query

        console.log(postData);

        return $.ajax({
            type: 'POST',
            url: Venues.getShowsByVenue,
            data: postData,
            async: false,
            // Success callback will fire even when coupled with an external $.done
            success : function(response, status) {  // data, status, jqXHR
                console.log(status);
                if (status === 'success' && response) {
                    // Save current artist data in global cache
                    CACHE['eventData'] = response;
                    return(response);
                }
                // else
                alert("No data to display");
            },
            // if the request fails, deferred.reject() is called
            error : function(code, message){
                // Handle error here
                // TODO:  change to jquery UI modal that autofades and has (X) button
                return Error("Unable to load Event data =(");
            }
        }); // End getShows $.ajax
    },// End getShows

    /**
     * displayVenues
     * show us what and where
     */
    displayShowsByVenue: function(venues) {
        var hasDistance = venues[0].distance != '-1';

        // Only bother  sorting by distance if part of the response
        if (hasDistance) {
            venues.sort(function(a, b) {  
                // sort by proximity (closest first)          
                return parseFloat(a.distance) - parseFloat(b.distance);
            });
        }
        var venuesHtml = '';
        
        // $('#' + CONTENT_DIV).empty();

        $('#swiper-content').empty();

        $(venues).each(function() {
            venueid = this.id;
            eventid = this.eventid;

            btnClass = 'btn-inactive';

            // Check whether this Venue has been added to our favorites yet
            // TODO:  Need to pass in the array of Favorite Venues, cannot access directly here!
            /*
            if (UserState.faveVenues.filter(function(venue) {
                   console.log(" >>" + venueId);
                   return venue.id == venueId;
                }).length === 1) {
                btnClass = 'btn-active';
            }
            */
        
            $bootstrapParent = $('<div>')
                .addClass('swiper-slide');
                // .addClass('pad-top-10 col-xs-12 col-sm-6 col-md-4 col-lg-3');

            $eventTile  = $('<div>')
                .attr('data-eventid', eventid)
                .addClass('left event-tile');

             // If we have a photo, show it!
            if (typeof this.media !== undefined && this.media !== '') {
                // console.log(this.media);
                $eventTile.css('background', 'url(\'' + this.media + '\')');
            }
            else {
                $eventTile.css('background', 'url(\'media/images/no-artist-photo.jpg\')');
            }

            // Parent div
            $showContent = $('<div>')
                .addClass('event-tile-bottom bg-almost-white');
                               
            // Artist
            $showArtist = $('<div>')
                .addClass('block large-text mid-gray pad-lr-10')
                .html(this.artist);

            // Show Venue
            $showVenue = $('<div>')
                .addClass('medium-text line-height-100 dk-gray pad-lr-10')
                .html(this.venue);
            
            // Favorite button
            $faveButton = $('<div>')
                .addClass('faveButton inline-block pad-left-6 ' + btnClass)
                .attr('data-id', this.id)   
                .html('<img src="media/svg/heart.svg" ' +
                    'class="toggle-button icon-link" ' + 
                    'alt="Save Favorite" />'); 

            // Date of show
            $showDate = $('<div>')
                .addClass('block medium-text dk-gray pad-lr-10')
                .html(this.nice_date);  // ' ' 


            var locationText = this.city;

            // Only display distance from Venue if set
            if (hasDistance) {
                locationText += ' • ' + parseFloat(this.distance.toFixed(1)) + ' mi. away'
            }
                 
            $showLocation = $('<div>')
                .addClass('small-text bg-almost-white color-dk-gray pad-lr-10')
                .html(locationText);

            $colorBar = $('<div>')
                .addClass('event-tile-color-bar small-text white pad-lr-10')
                .css('background-color', 'rgba(51, 102, 255, 0.9)')
                .html(this.type + ' • ' + this.source);
            
            //$showContent.append($faveButton);
            
            $showContent.append($showArtist);

            $showVenue.append($faveButton);
            $showContent.append($showVenue);
            
            $showContent.append($showDate);
            $showContent.append($showLocation);
            $showContent.append($colorBar);

            $eventTile.append($showContent);

            $bootstrapParent.append($eventTile);

            // Incrementally append to DOM
            //$('#' + CONTENT_DIV).append($bootstrapParent);
            $('#swiper-content').append($bootstrapParent);
        });
    },// End displayVenues


}// End object Venues
