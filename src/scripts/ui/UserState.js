/*
 * UserState.js
 *
 **/

  var UserState = {
    // DATA CACHING
    events: [],
    // PROPERTIES
    faveVenues: [{id: 25, name: 'Echoplex'}, {id: 16, name: 'The Troubadour'} ],
    nearbyVenues: [],
    searchTerms: ['wednesday','echo park', 'hiphop', 'punky reggae music'],
    lastPageState: 'home',
    calendarDisplay: 'week',
    // object will contain HTML5 coordinates object verbatim,
    // as returned by navigator.geolocation.getCurrentPosition()
    userPosition: [],

    //
    // LOCATION
    //

    /**
    * getSavedUserPosition :: returns value stored in singleton object
    */
    getSavedUserPosition: function() {
      if (this.userPosition.lat === 'undefined' ||
         this.userPosition.lon === 'undefined') {
         // return the default coordintes set in constants.js
         // return lat, lon, and accuracy (-1 so we know they're default values)
         return {
            'lat': USER_LAT,
            'lon': USER_LON,
            'accuracy': -1
         };
      }
      else {
         return this.userPosition;
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

      //console.log(" >>>> UserState.setUserPosition ")
      //console.log(this.userPosition);
    },

    /**
    * geoSuccess
    * geolocation success callback
    * @param {Array} msg
    */
    geoSuccess: function(position) {
        UserState.setUserPosition(position);
        console.log( " (+) geoSuccess " );
        return UserState.getSavedUserPosition;
    },

    /**
    * geoError
    * geolocation error callback
    * @param {String} msg
    */
    geoError: function (msg) {
      /* var s = document.querySelector('#status');
      s.innerHTML = typeof msg == 'string' ? msg : "failed";
      s.className = 'fail'; */
      console.log(" >>> geoError :: msg.code = " + msg.code);

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
          $errorMsg.dialog("open");
      }, 1000);

      // msg.code
      //  1 = PERMISSION_DENIED
      //  2 = POSITION_UNAVAILABLE
      //  3 = TIMEOUT

      // TODO: replace with an autofading (auto-dismissed) modal
      var userMessage = "Couldn't get your location. ";
      switch (msg.code) {
         case 1: {
            userMessage += "Please make sure you give the app access to your location.";
         }
         case 2: {
            userMessage += "Your position is unavailable.";
         }
         case 3: {
            userMessage += "Please check your network connection " +
               "and allow this app access to your location when asked.";
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

    // get
    getUserState: function() {
      var currentStatus = JSON.parse(localStorage["UserState"]);
      return currentStatus;
    },
    // set
    setUserState: function() {
      var UserState = {
         faveVenues: this.faveVenues,
         nearbyVenues: this.nearbyVenues,
         searchTerms: this.searchTerms,
         pageState: this.lastPageState,
         calendarDisplay: this.calendarDisplay,
         userPosition: this.userPosition
      };
      localStorage["UserState"] = JSON.stringify(UserState);
    },


    //
    // FAVORITE VENUES
    //
    getFaveVenues: function() {
      return this.faveVenues;
    },
    addFaveVenue: function(venue) {
        // if it doesn't already exist
        this.faveVenues.push(venue);
    },

    //
    // NEARBY VENUES
    //
    getNearbyVenues: function() {
      return this.nearbyVenues;
    },
    setNearbyVenues: function(venues) {
        // if it doesn't already exist
        this.setNearbyVenues = venues;
    },


    //
    // SEARCH TERMS
    //
    getSearchTerms: function() {
      return this.searchTerms;
    },
    setSearchTerm: function(search_term) {
      this.faveVenues.push(search_term);
    },

    //
    // PAGE STATE
    //
    getLastPageState: function () {
      return this.lastPageState;
    },
    setLastPageState: function(currrent_state) {
      this.lastPageState = currrent_state;
    },

    // Calendar layout
    getCalendarDisplay: function() {
      return this.calendarDisplay;
    },
    setCalendarDisplay: function(currrent_state) {
      this.lastPageState = currrent_state;
    },

  };// End object UserState
