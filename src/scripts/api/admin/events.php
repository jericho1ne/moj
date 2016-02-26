<?php
include_once('../../common/common.php');
require_once("../db/__db_upd.php");
require_once("../db/__db_connex.php");
include_once('../EventParser.php');
//============================================================

// Current (potentially outdated JSON data)
// $jsonFile = "../../data/events.json";
// $rawJson = json_decode(file_get_contents($jsonFile));
// $hrsElapsed = 999;
// if (isset($rawJson->timestamp)) {
// 	// Find out time elapsed in hours - formerly was using filemtime($jsonFile)	
// }
// $hrsElapsed = (time() - $rawJson->timestamp) / (60*60);

// Grab submitted action from POSTed form
$action = set($_POST['action']);

// Scrape new stuff
if ($action === 'getNewShows' && $dblink) {
	// Create new EventParser
	$Events = new EventParser($dblink);
	// Get newest shows
	$Events->parseScenestarUrl('http://thescenestar.typepad.com/shows/');
	// Grab resulting events aray
	// $eventsList = $Events->getEvents();

	// Save newly scraped events to DB, 
	//	updating only if show link or title have changed
	$Events->saveEventsToDb($dblink);
}
// Grab shows saved in DB
else if ($action === 'getExistingShows' && $dblink) {
	// Create new EventParser
	$Events = new EventParser($dblink);

	$cutoffDate = new DateTime();
	$cutoffDate->modify("+30 days");
	$date = $cutoffDate->format("Y-m-d");
	// echo $date;

	// Get shows from today onwards
	$localEvents = $Events->getEventsFromDb('text', $date);

	pr($localEvents);
}
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
<input type="radio" name="action" value="getNewShows"> Get Most Recent Shows<br>
<hr>
<input type="submit" name="submit" value="Hit it.">
<br>
</form>

</body>
</html>
