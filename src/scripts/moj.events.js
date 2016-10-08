/**
 * @file moj.events.js Action listeners to append after HTML doc has loaded
 * @author Mihai Peteu
 * @copyright 2016 Middle of June.  All rights reserved.
 */
$(document).ready(function() {
    var fmtDate = getTodaysDate();
    
     console.log(fmtDate);

     window.fmtDate = fmtDate;

    // Initialize UserState 
    mojUserState = UserState.getInstance();

    // Set background plate
    $('#bg-plate').css(
        'background', 
        'url("media/backgrounds/' + BG_PLATES[fmtDate.day] + '") ' + 'no-repeat center bottom scroll'
    );

    /*
     *      Left / Right Slider arrows
     */
    $('#arrow-right').on('click', function() {
        // Get new day's show data
        showEventSlider({
            'startDate': UserState.props.currentDate.nice,
            'maxResults': Events.MAX_perDay,
            'daysChange': 1
        });
    });
    $('#arrow-left').on('click', function() {
        // Get new day's show data
        showEventSlider({
            'startDate': UserState.props.currentDate.nice,
            'maxResults': Events.MAX_perDay,
            'daysChange': -1
        });
    });


    /** 
     *      Event Slider
     *         Grab shows and display them in swipeable thumbnails
     */
    showEventSlider({
        'startDate': '',
        'daysChange': '',
        'maxResults': Events.MAX_perDay
    });



    
    /**
     *      Calendar View
     *          Get list of shows, display them, set click listeners on each Artist
     */
    $('#action-calendarView').on('click', function() {
        var viewMode = $(this).data('mode');
        console.log(" >> viewMode : " + viewMode);
        
        // We're in slider mode, need to change to Calendar
        if (viewMode === 'slider') {
            $(this).toggleClass('toggle-button-active', true);
            showEventCalendar();
        }
        // We're in Calendar mode, need to change to Slider
        else {
            $(this).toggleClass('toggle-button-active', false);
            showEventSlider({
                'startDate': '',
                'daysChange': '',
                'maxResults': Events.MAX_perDay
            });
        }
    }); // End UI toggle between Calendar and Slider

    $('#action-eml').click(function() {
        var emlad = rvStr($("#eml").data("u")) + '@' + rvStr($("#eml").data("dom"));
        document.location.href = 'ma' + 'il' + 'to' + ':' + emlad;
    });

    /*
     *      Header collapse upon scroll
     */ 
    $(window).scroll(function(e) { 
        var divHeight = 75;
        var $secondaryHeader = $('#secondaryHeader'); 

        // Squeeze down header
        if ($(this).scrollTop() > divHeight) {
            $('#titleHeader').addClass('titleHeader-secondary');
            $('#mojBannerText').addClass('mojBannerText-secondary blur');
        }
        // Return to original look
        else if ($(this).scrollTop() < divHeight) {
            $('#titleHeader').removeClass('titleHeader-secondary');
            $('#mojBannerText').removeClass('mojBannerText-secondary blur');
        } 
    });

    /*
     *      Asynchronously load modal template
     */
    $.get('templates/artist-modal.html', function(template) {
        // Inject all those templates at the end of the document.
        $('body').append(template);
    });


    /*
     *      Distance slider
     */ 
    // $('#range-slider').slider({
    //     tooltip: 'always',
    //     formatter: function(value) {
    //         return value + ' miles';
    //     }
    // });

    // // Set slide listener to search for nearby venues on each drag
    // $("#range-slider").on("slide", function(e) {
    //     var chosenDistance = e.value;
    //     // console.log(chosenDistance);

    //     Venues.getShows({
    //      'coords': mojUserState.getSavedUserPosition(), 
    //      'maxResults': 10, 
    //      'maxDistance': chosenDistance
    //     });
    //     //$("#ex6SliderVal").text(e.value);
    // });

   

    //
    // Google plus login
    //
    // $('#gPlusLogin').click(function() {
    //     var ref = new Firebase("https://blinding-torch-6251.firebaseio.com");
    //     ref.onAuth(function(authData) {
    //         if (authData !== null) {
    //             console.log("Login Success!", authData);
    //             window.authData = authData;
    //         } 
    //         else {
    //             ref.authWithOAuthRedirect('google', function(error, authData) {
    //                 if (error) {
    //                     console.log("Problems Houston...", error);
    //                 }
    //             });// End authWithOAuthRedirect
    //         }// End else
    //     })// End ref.onAuth
    // });

    // $('#action-getposition').click(function() {
    //     // Append distance slider to toolbar
    //     //$('#slider-parent').toggleClass('hidden', false);
        
    //     // Fade out slider, remove distance constraint
    //     if ($('#slider-parent').is(":visible")) {
    //          $('#slider-parent').fadeOut(500);
    //          // TODO:  remove distance constraint from datatable
    //     }
    //     // Fade in slider, geolocate
    //     else {
    //         $('#slider-parent').fadeIn(500);
    //         // Get current position and enable distance slider if successful
    //         mojUserState.geoLocateUser(10000)   
    //             .then(function(position) {
    //                 // Immediately store current user position, saving
    //                 // lat, lon, and accuracy
    //                 mojUserState.setUserPosition(position);

    //                 // Grab coordinates separately for the first getShows call
    //                 var coordinates = {
    //                     lat: position.coords.latitude,
    //                     lon: position.coords.longitude
    //                 };

    //                 // We have a position to work with, so activate distance slider
    //                 if (!isBlank(coordinates.lat)) {
    //                     $('#range-slider').slider('enable');
    //                 }

    //                 // Get venues close to us, passing in {lat,lon}, 
    //                 // max distance, and the current slider's search radius
    //                 Venues.getShows({
    //                     'maxResults': 10,
    //                     'coords': coordinates, 
    //                     'maxDistance': $("#range-slider").val()
    //                 });
    //             });
    //     }// End else case

    // });// End action-getposition

    // $('#getNearbyVenues').click(function() {
    //     // Get venues within 25 miles, max 10 results
    //     getNearbyVenues(25, 4);
    // });

    // // Should be calling set/loadPageState automatically!
    // // 
    // $('#setPageState').click(function() {
    //     // Parse the hashtag section from URL
    //     var lastSection = window.location.href.split("/").pop();
    //     // console.log(lastSection);

    //     // Save the last visited page
    //     setPageState(lastSection);
    // });
});// End on Document Load
