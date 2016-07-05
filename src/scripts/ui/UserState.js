/*
 * UserState.js
 *
 **/
var UserState = (function() {
    // Instance stores a reference to the Singleton
    var instance;

    /**
     * [init description]
     * @return {[type]} [description]
     */
    function init() { 
        //
        //  Private
        //
        var events = [];
    
        return {
            //
            // PUBLIC PROPERTIES
            //
            properties: {
                faveVenues: [
                    {id: 25, name: 'Echoplex'}, 
                    {id: 16, name: 'The Troubadour'}
                ],

                searchTerms: ['wednesday', 'echo park', 'hiphop', 'punky reggae music'],
                nearbyVenues: [],
                lastPageState: 'home',
                calendarDisplay: 'week',

                // object will contain HTML5 coordinates object verbatim,
                // as returned by navigator.geolocation.getCurrentPosition()
                userPosition: [],

                // Whether visitor has seen the intro text already
                // (eg: UI should be simplified upon each subsequent visit)
                hasSeenIntro: false, 
            },
    
            //
            // PUBLIC METHODS
            // 
            
            
            // Public methods and variables
            publicMethod: function () {
                console.log( "The public can see me!" );
            },
            publicProperty: "I am also public",
            

            /**
             * getSavedUserPosition :: returns value stored in singleton object
             */
            getSavedUserPosition: function() {
              if (this.properties.userPosition.lat === 'undefined' ||
                 this.properties.userPosition.lon === 'undefined') {
                 // return the default coordintes set in constants.js
                 // return lat, lon, and accuracy (-1 so we know they're default values)
                 return {
                    'lat': USER_LAT,
                    'lon': USER_LON,
                    'accuracy': -1
                 };
              }
              else {
                 return this.properties.userPosition;
              }
            },

            /**
            * setUserPosition :: saves coordinate object in singleton object
            * @param {Array} coordinates
            */
            setUserPosition: function(position) {
              this.userPosition = {
                 'lat' : position.coords.latitude,
                 'lon' : position.coords.longitude,
                 'accuracy' : position.coords.accuracy
              };

              this.saveUserState();

              //console.log(' >>>> UserState.setUserPosition ')
              //console.log(this.userPosition);
            },

            /**
            * geoSuccess
            * geolocation success callback
            * @param {Array} msg
            */
            geoSuccess: function(position) {
                UserState.setUserPosition(position);
                console.log(' (+) geoSuccess ');
                return UserState.getSavedUserPosition;
            },

            /**
            * geoError
            * geolocation error callback
            * @param {String} msg
            */
            geoError: function (msg) {
              /* var s = document.querySelector('#status');
              s.innerHTML = typeof msg == 'string' ? msg : 'failed';
              s.className = 'fail'; */
              console.log(' >>> geoError :: msg.code = ' + msg.code);

              // Contents of popup error modal
              $errorMsg = $('<div>')
                .attr('id', 'error-modal')
                .attr('title', 'Gelocation Error')
                .html('<b>geoError</b> - msg.code: ' + msg.code);

              // Initialize dialog box
              $errorMsg.dialog({
                autoOpen: false,
                height: 200,
                width: 500,
                modal: true,
                resizable: true,
                dialogClass: 'no-close error-dialog'
              });

              // Display error msg modal
              setTimeout(function(){
                  $errorMsg.dialog('open');
              }, 1000);

              // msg.code
              //  1 = PERMISSION_DENIED
              //  2 = POSITION_UNAVAILABLE
              //  3 = TIMEOUT

              // TODO: replace with an autofading (auto-dismissed) modal
              var userMessage = 'Could not get your location. ';
              switch (msg.code) {
                 case 1: {
                    userMessage += 'Please make sure you give the app access to your location.';
                 }
                 case 2: {
                    userMessage += 'Your position is unavailable.';
                 }
                 case 3: {
                    userMessage += 'Please check your network connection ' +
                       'and allow this app access to your location when asked.';
                 }
                 default: {
                    //
                 }
              }// End switch msg.code
              alert(userMessage);
              return false;
            },

            /**
            * geoLocateUser
            * attempts to grab the device coordinates
            */
            geoLocateUser: function(timeout) {
                var def = $.Deferred();

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(def.resolve, def.reject, {
                        enableHighAccuracy: true,
                        timeout: timeout
                    });
                }
                else {
                    //Reject the promise with a suitable error message
                    def.reject(new Error('Your browser does not support Geo Location.'));
                }
                return def.promise();
            }, // End method geoLocateUser


            //
            // USER STATE
            //    Saves all user settings to localStorage (periodically called)
            //

            /**
             * [getSavedUserState description]
             * @return {[type]} [description]
             */
            getSavedUserState: function() {
              var currentStatus = JSON.parse(localStorage['mojUserState']);
              return currentStatus;
            },

            /**
             * [saveUserState description]
             * @return {[type]} [description]
             */
            saveUserState: function() {
                var UserState = {
                    faveVenues: this.faveVenues,
                    nearbyVenues: this.nearbyVenues,
                    searchTerms: this.searchTerms,
                    pageState: this.lastPageState,
                    calendarDisplay: this.calendarDisplay,
                    userPosition: this.userPosition,
                    hasSeenIntro: this.hasSeenIntro,
                };
                localStorage['mojUserState'] = JSON.stringify(UserState);
            },

            /**
             * [setHasSeenIntro description]
             * @return {Boolean} [description]
             */
            setHasSeenIntro: function(state) {
              UserState.hasSeenIntro = state;
              localStorage['hasSeenIntro'] = JSON.stringify(state);
            },


            //
            // FAVORITE VENUES
            //
            
            /**
             * [getFaveVenues description]
             * @return {[type]} [description]
             */
            getFaveVenues: function() {
              return this.properties.faveVenues;
            },
            /**
             * [addFaveVenue description]
             * @param {[type]} venue [description]
             */
            addFaveVenue: function(venue) {
                // if it doesn't already exist
                this.faveVenues.push(venue);
            },

            //
            // NEARBY VENUES
            //
            getNearbyVenues: function() {
              return this.properties.nearbyVenues;
            },
            setNearbyVenues: function(venues) {
                // if it doesn't already exist
                this.setNearbyVenues = venues;
            },


            //
            // SEARCH TERMS
            //
            getSearchTerms: function() {
              return this.properties.searchTerms;
            },
            setSearchTerm: function(search_term) {
              this.properties.faveVenues.push(search_term);
            },

            //
            // PAGE STATE
            //
            getLastPageState: function () {
              return this.properties.lastPageState;
            },
            setLastPageState: function(currrent_state) {
              this.properties.lastPageState = currrent_state;
            },

            // Calendar layout
            getCalendarDisplay: function() {
              return this.properties.calendarDisplay;
            },
            setCalendarDisplay: function(currrent_state) {
              this.properties.lastPageState = currrent_state;
            },

        };// End init()'s return

    };// End function init
    
    // Autoexecute
    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            console.log('mojUserState created!');

            if (!instance) {
                instance = init();
            }
            return instance;
        }// End function getInstance    
    };

})();// End object UserState

