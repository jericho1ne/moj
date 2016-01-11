/*
 * Events.js
 *
 **/

var Events = {
   // PROPERTIES
   dataBaseURL: 'data/',
   eventsJSON: 'events.json',

   apiScriptsBase: 'scripts/api/',
   eventsScript: 'getEvents.php',

   eventsList: [],

   /**
    * displayEvents
    * display events inside the div id we've passed in
    */
   displayEvents: function(eventsData, divId) {
      /*
         ----- data format ----
         artist: "Hanson"
         date: "1446361200000"
         fmt_date: "2015-11-01"
         nice_date: "Sunday Nov 1"
         title: "Hanson @ Fonda Theatre"
         type: "show"
         url: "http://www.axs.com/events/280155/hanson-tickets?skin=goldenvoice"
         venue: "Fonda Theatre"
         year: "2015"
      */

      // clear div contents
      $("#" + divId).html('');

      var eventsHtml = '';

      // Loop through incoming data
      $(eventsData).each(function() {
         // $("a").attr("href", "http://www.google.com/")
         eventsHtml =
            this.nice_date + ' • ' +
            '<a href="' + this.url + '">' + this.title + '</a> ' +
            '<br>';
         // Incrementally append to DOM
         $("#" + divId).append(eventsHtml);
      });
   },// End displayEvents

   /**
    * getEvents
    * list of events, bounded by certain input parameters
    */
   getEvents: function(divId, maxResults) {
      // we'll need this refernce later inside the $.ajax scope
      var _this = this;

      var requestBody = {
         type: "GET",
         url: this.apiScriptsBase + this.eventsScript,
         async: false
      };// End requestBody


      $.ajax(requestBody).done(function(data, status, jqXHR) {
         if (status === 'success') {
            if (data) {
                // Script returns JSON string, so parse it first
                _this.displayEvents(JSON.parse(data), divId);
               return true;
            }
         }
         else {
            alert("No data returned :(");
            return false;
         }
      });//End $.ajax
   },// End getEvents

}// End object Events
