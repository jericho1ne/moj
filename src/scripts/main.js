/**
 * @file main.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2016 Middle of June.  All rights reserved.
 */

//
// Methods outside of document.ready
//

/**
 * lookupArtist(artistName)
 * Old school HTML onclick call generated by Events list
 * Needs to be outside document.ready or it'll throw undefined error
 */
function lookupArtist(artistName) {
      // Create div to hold modal contents
    var $artistPopup = $('<div>');

    // Initialize dialog box
    $artistPopup.dialog({
        autoOpen: false,
        modal: true,
        resizable: true,
        dialogClass: 'info-dialog',
        // Provide the close method
        close: function(event, ui) {
            $(this).dialog('destroy').remove();
        }
    });
    $artistPopup.load('templates/artist-popup.html');
    
    // Pop up the info modal
    $artistPopup.dialog("open");

    $artistPopup.css({
        'width': $(window).width(),
        'height': $(window).height(),
   });

    // Add close button listener; use $(document).on if this stops firing
    $('.ui-dialog').on('click', '#closeModalBtn', function() {
        // Fade out modal
        $artistPopup.fadeOut( "fast", function() {
            // Completely destroy modal
            $artistPopup.dialog('close');
        }); 
    });

    // Delay Promise chain until dialog is popped open!
    setTimeout(function() {

        //
        // Events / Artist info promise chain
        //

        // returns $.ajax from Last.fm API
        Events.getArtistInfo(artistName)
            .then(function(artistData) {
                return Events.appendArtistInfo('artist-info', artistData);
            })
            .then(function(artistName) {       
                // returns $.ajax from Youtube API
                return Events.getTopTracks(artistName);
            })
            .then(function(trackData) {
                Events.appendTopTracks('artist-tracks', trackData);
            })

    }, 10);// End setTimeout

}// End lookupArtist

//
// Methods registered after document.ready
//
$(document).ready(function() {
    //
    // LISTENERS
    //
    $('#gPlusLogin').click(function() {
        var ref = new Firebase("https://blinding-torch-6251.firebaseio.com");
        ref.onAuth(function(authData) {
            if (authData !== null) {
                console.log("Login Success!", authData);
                window.authData = authData;
            } 
            else {
                ref.authWithOAuthRedirect("google", function(error, authData) {
                    if (error) {
                        console.log("Problems Houston...", error);
                    }
                });// End authWithOAuthRedirect
            }// End else
        })// End ref.onAuth
    });

    $('#getPosition').click(function() {
        // Get venues within 25 miles, max 10 results
        getPosition();
    });

    // Get events data ajax call, push to DOM
    $('#getEvents').click(function() {
    // 
    });// End getEvents

    $('#getNearbyVenues').click(function() {
    // Get venues within 25 miles, max 10 results
    getNearbyVenues(25, 4);
    });

    $('#setPageState').click(function() {
    // Parse the hashtag section from URL
    var lastSection = window.location.href.split("/").pop();

    // Save the last visited page
    setPageState(lastSection);
    });


    // 
    // Get list of shows, display them, set click listeners on each Artist
    //
    Events.getEvents(10)
        // returns $.ajax
        .then(function(data) {
            // JSON data will go into shows-content div
            Events.displayEvents(JSON.parse(data), 'shows-content');
        })
        .then(function(){
            // Add old school 
            // https://davidwalsh.name/event-delegate
            document.getElementById('shows-content').addEventListener("click", function(e) {
                // If any child element was clicked, grab the artist name
                if (e.target && e.target.innerHTML !== '') {
                    // Lookup the artist name
                    lookupArtist(e.target.innerHTML);
                }
            });// End addEventListener
        });

});// End on Document Load
