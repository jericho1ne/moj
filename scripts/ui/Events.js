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
    displayEvents: function(data, divId) {
        // Create the deferred object ourselves
        var deferred = $.Deferred();


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

        // Loop through incoming data
        // $(eventsData).each(function() {
        for (var i in data) {
            // Date | Artist | Venue
            var $dataRow = $('<tr>')
                .addClass('line-item' + (rowCount % 2 ? '' : ' alternate-bgcolor'))
                .html('<td class="left">'
                    + data[i].nice_date + '</td>'       // ideally, use fmt_date

                    // For artist, use a highlighted bg color if a fave
                    // style="background-color:' + expenseCategories[row.label].color + '"
                    + '<td class="left"><span class="link artistInfo">' + data[i].artist + '</span></td>'
                    
                    + '<td class="left">' + data[i].venue + '</td>'
                    
                    + '<td class="left"><a href="' + data[i].url + '">' 
                    + '<i class="fa fa-ticket fa-4"></i>' + '</a></td>'
                    + '</tr>' );

            // Append individual event row
            $dataTable.append($dataRow);

            rowCount ++;

            // if (rowCount > 40) break;
        }
        // });// End eventsData.each
        
        $dataTable.append('</tbody>');

        // The final append to DOM
        $('#' + divId).append($dataTable);

        //
        //  Call upon the magic of ~ DataTables ~
        //
        setTimeout(function(){ 
            $('#' + dataTableUniqueID).DataTable({
                "lengthMenu": [[20, 40, 80, -1], [20, 40, 80, "All"]],
                // 0 = date, 1 = artist, 2 = venue, 3 = ticket
                "order": [[ 0, "asc" ]]
            });
        }, 200);

        // Give the datatable a chance to complete attaching, then call it quits
        setTimeout(function() {
            deferred.resolve();
        }, 600);
       
        // Always return deferred object regardless
        return deferred.promise();
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
                console.log(' >> events XHR success >>');
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

}// End object Events
