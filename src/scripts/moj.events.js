/**
 * @file moj.events.js Action listeners to append after HTML doc has loaded
 * @author Mihai Peteu
 * @copyright 2016 Middle of June.  All rights reserved.
 */
$(document).ready(function() {
    var fmtDate = getTodaysDate();

    // Set background plate based on current time (new photo every hour)
    $('#bg-plate').css(
        'background', 
        'url("media/backgrounds/' + BG_PLATES[fmtDate.hour] + '") ' + 'no-repeat center bottom scroll'
    );

    // Initialize UserState singleton with today's date
    UserState.init(fmtDate.ymd);

    /*
     *      Set Left / Right Slider arrow actions
     */
    $('#arrow-right').on('click', function() {
        // Get new day's show data
        showEventSlider({
            'startDate': UserState.getDisplayedDate(),
            'maxResults': Events.MAX_perDay,
            'daysChange': 1
        });
    });
    $('#arrow-left').on('click', function() {
        // Get new day's show data
        showEventSlider({
            'startDate': UserState.getDisplayedDate(),
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
        
        // We're in slider view mode, need to change to Calendar
        if (viewMode === 'slider') {
             // Update toggle button state, set the mode
            $(this).toggleClass('toggle-button-active', true);
            $('#action-calendarView').data('mode', 'calendar')

            // Drop the slider
            $('#swiper-parent').hide();

            // Data previously loaded, unhide Calendar
            if ($('#' + CALENDAR_DIV).data('loaded')) {
                $('#' + CALENDAR_DIV).show();
            }
            //  Else, first time loading Calendar
            else {
                showEventCalendar(); 
            }
        }
        // We're in Calendar view mode, need to change to Slider
        else if (viewMode === 'calendar') {
            // Update toggle button state, set the mode
            $(this).toggleClass('toggle-button-active', false);
            $('#action-calendarView').data('mode', 'slider');

            // Hide Calendar
            $('#' + CALENDAR_DIV).hide();

            if ($('#swiper-parent').data('loaded')) {
                $('#swiper-parent').show();
            }
            else {
                showEventSlider({
                    'startDate': '',
                    'daysChange': '',
                    'maxResults': Events.MAX_perDay
                });            
            } 
        }// End else in Calendar mode, switch to Slider
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
            $('#mojBannerText').addClass('mojBannerText-secondary');
        }
        // Return to original look
        else if ($(this).scrollTop() < divHeight) {
            $('#titleHeader').removeClass('titleHeader-secondary');
            $('#mojBannerText').removeClass('mojBannerText-secondary');
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
    //      'coords': UserState.getSavedUserPosition(), 
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
    //         UserState.geoLocateUser(10000)   
    //             .then(function(position) {
    //                 // Immediately store current user position, saving
    //                 // lat, lon, and accuracy
    //                 UserState.setUserPosition(position);

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
