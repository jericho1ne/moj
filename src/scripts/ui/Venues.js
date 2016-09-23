/*
 * Venues.js
 *
 **/

var Venues = {
	// PROPERTIES
	// apiKey: "AIzaSyCF4m5XE3VTOUzo8b10EstraU1depENiB4",
	baseURL: 'scripts/api/getShowsAndVenues.php',
	venuesList: [],

	/**
	 * getVenues
	 * list of venues
	 */
	getVenues: function(coords, maxDistance, maxResults) {
		console.log(" >> getVenues >> ");
		console.log(coords);

		// we'll need this refernce later inside the $.ajax scope
		var _this = this;

		var requestBody = {
			type: 	"GET",
			url: 	this.baseURL +
					"?lat=" + coords.lat +
					"&lon=" + coords.lon +
					"&maxResults=" + maxResults +
					"&maxDistance=" + maxDistance,
			async: false
		};// End requestBody

		$.ajax(requestBody).done(function(data, status) {
			if (status === 'success') {
				if (data) {
                    _this.venuesList = JSON.parse(data);
                    _this.displayVenues(_this.venuesList);
                    
           			// for (var i in _this.venuesList) {
			        //     console.log(_this.venuesList[i]);
			        // }

					return true;
				}
			}
			else {
				alert("No data returned :(");
				return false;
			}
		});//End $.ajax
	},// End getVenues

    /**
     * displayVenues
     * show us what and where
     */
    displayVenues: function(venues) {
        venues.sort(function(a, b) {            // sort by proximity (closest first)
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        var venuesHtml = '';
        $('#' + CONTENT_DIV).empty();

        $(venues).each(function() {
            venueID = this.id;
            btnClass = 'btn-inactive';

            // Check whether this Venue has been added to our favorites yet
            // TODO:  Need to pass in the array of Favorite Venues, cannot access directly here!
            /*
            if (UserState.faveVenues.filter(function(venue) {
	               console.log(" >>" + venueID);
	               return venue.id == venueID;
	            }).length === 1) {
            	btnClass = 'btn-active';
            }
			*/
		
            $bootstrapParent = $('<div>')
            	.addClass('pad-top-10 col-xs-12 col-sm-6 col-md-4 col-lg-3');

            $eventTile  = $('<div>')
            	.addClass('left event-tile');

             // If we have a photo, show it!
            if (typeof this.media !== undefined && this.media !== '') {
            	// console.log(this.media);
            	$eventTile.css('background', 'url(\'' + this.media + '\')');
            }
            else {
            	$eventTile.css('background', 'url(\'media/images/no-artist-photo.jpg\')');
            }

	        $showContent = $('<div>')
            	.addClass('event-tile-bottom bg-almost-white');

            $showVenue = $('<div>')
            	.addClass('block large-text line-height-100 dk-gray pad-lr-10')
            	.html(this.venue);

            $faveButton = $('<div>')
            	.addClass('faveButton inline-block ' + btnClass)
            	.attr('data-id', this.id)	
            	.html('<img src="media/svg/heart.svg" class="toggle-button icon-link" alt="Save Favorite" />'); 
	            
        
            $showDate = $('<div>')
            	.addClass('block medium-text dk-gray pad-lr-10')
	            .html(this.nice_date);  // ' ' 
               
            $showArtist = $('<div>')
            	.addClass('block medium-text mid-gray pad-lr-10')
            	.html(this.artist);

            //   + '<a href="#' + this.url + '">' + this. + '</a> <br>'
          
            $showLocation = $('<div>')
            	.addClass('small-text bg-almost-white color-dk-gray pad-lr-10')
            	.html(this.city + ' • ' + parseFloat(this.distance.toFixed(1)) + ' mi. away');

        	$colorBar = $('<div>')
            	.addClass('event-tile-color-bar small-text white pad-lr-10')
            	.css('background-color', 'rgba(51, 102, 255, 0.9)')
            	.html(this.type + ' • ' + this.source);
            
            //$showContent.append($faveButton);
            
            $showVenue.append($faveButton);

            $showContent.append($showVenue);
            $showContent.append($showDate);
            $showContent.append($showArtist);
            $showContent.append($showLocation);
			$showContent.append($colorBar);

			$eventTile.append($showContent);

			$bootstrapParent.append($eventTile);

            // Incrementally append to DOM
            $('#' + CONTENT_DIV).append($bootstrapParent);
        });
    },// End displayVenues


}// End object Venues
