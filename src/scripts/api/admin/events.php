<?php
include_once('../../common/common.php');
require_once("../db/__db_upd.php");
require_once("../db/__db_connex.php");
include_once('../EventParser.php');
//============================================================

// In case we want to automate getting fresh data...
// $hrsElapsed = 999;
// if (isset($rawJson->timestamp)) {
// 	// Find out time elapsed in hours - formerly was using filemtime($jsonFile)	
// }
// $hrsElapsed = (time() - $rawJson->timestamp) / (60*60);

// Grab submitted action from POSTed form
$action = set($_POST['action']);
$saveToDB = set($_POST['saveToDB']);


if ($dblink && $action !== "") {
	// Create new EventParser	
	$Events = new EventParser($dblink);

	// Grab shows saved in DB
	if ($action === 'getExistingShows') {
		$cutoffDate = new DateTime();
		$cutoffDate->modify("+30 days");
		$date = $cutoffDate->format("Y-m-d");
		// echo $date;

		// Get shows from today onwards
		$localEvents = $Events->getEventsFromDb('text', $date);

		pr($localEvents);
	}
	// Scrape Scenestar
	else if ($action === 'getNewScenestarShows') {
		// Get newest shows
		$Events->parseScenestarUrl('http://thescenestar.typepad.com/shows/');
		// Grab resulting events aray
		// $eventsList = $Events->getEvents();
	}
	// Experience LA
	else if ($action === 'getNewExpLAevents') {
		$url = "http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=2016-3-4&keyword=";
		
		$allFutureEventsUrl = "http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=&keyword=";
		
		// Figure out today's date (format 2016-1-1)
		$today = date('Y-n-j');

		// Get events from today onwards
		$Events->parseExpLAxml('http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=' . $today . '&enddate=&keyword=');

		$eventsList = $Events->getEvents();
	}
	// Ticketfly! 
	else if ($action === 'getNewTicketflyevents') {
		$url = "http://www.ticketfly.com/api/events/upcoming.json?orgId=1&fieldGroup=light&city=Los%20Angeles&maxResults=2000";
		
		// Figure out today's date (format 2016-1-1)
		$today = date('Y-n-j');

		// Get events from today onwards
		$Events->parseTicketflyEvents($url);

		// $eventsList = $Events->getEvents();
	}

	//
	// If Save to DB checkbox is on
	// 
	if ($saveToDB) {
		// pr($eventsList);

		// Save received events to DB, updating only if show link or title have changed
		$Events->saveEventsToDb($dblink);
	}
}// End if dblink is set and there is a POST submit


// // Check JSON events file timestamp, 
// // only grab new data if stale AND the file is writable
// //if ($hrsElapsed > 12 && is_writable($jsonFile)) {

// 	// Format the data as JSON, save file in data directory
// 	// $json_events = $Events->getEventsJson();
// 	// $result = $Events->saveSingleEventToDb($dblink, $event);
// 	// pr($result);

// 	// $Events->saveJsonToFile('events', $jsonFile);

// 	// Also print out to screen, to satisfy the $.ajax from calling script
// 	//pr($events);
// 	// echo $json_events;

// //}
// // Data still fairly recent, Use cached file
// // //}
// // Save to CSV (if necessary)
// // $Events->saveVenuesCsv("../../data/venues.csv");
// // $Events->saveEventsCsv("../../data/events.csv");

?>
<html>
<body>

<form method="post" action="">
<input type="hidden" name="hiddenthing" value="1">
<input type="radio" name="action" value="getExistingShows"> Display Existing Shows <br>
<hr>
<input type="radio" name="action" value="getNewScenestarShows"> Get Scenestar Shows<br>
<input type="radio" name="action" value="getNewExpLAevents"> Get Experience LA Events<br>
<input type="radio" name="action" value="getNewTicketflyevents"> Hit Ticketfly API for the latest<br>
<br>
<input type="checkbox" name="saveToDB" value="1"> Save to DB!<br>
<hr>
<input type="submit" name="submit" value="Hit it.">
<br>
</form>

</body>
</html>
