<?php
include_once('../common/common.php');
include_once('EventParser.php');

// require_once("db/__db_upd.php");
// require_once("db/__db_connex.php");
// require_once("Geocoder.php");

//============================================================

// Current (potentially outdated JSON data)
$jsonFile = "../../data/events.json";

// Find out time elapsed in hours
$hrsElapsed = (time() - filemtime($jsonFile)) / (60*60);

// Check JSON events file timestamp, 
// only grab new data if stale AND the file is writable
if ($hrsElapsed > 12 && is_writable($jsonFile)) {
	// Constructor automatically calls parseURL
	$eventParser = new EventParser('http://thescenestar.typepad.com/shows/');

	// Format the data as JSON, save file in data directory
	$json_events = $eventParser->getEventsJson();
	$eventParser->saveJsonToFile('events', $jsonFile);

	// Also print out to screen, to satisfy the $.ajax call
	echo $json_events;
}
// Data still fairly recent, Use cached file
else {
	// TODO: trim data to only show from today's date onwards

	// Print JSON data 
	echo file_get_contents( $jsonFile );
}

// Save to CSV (if necessary)
// $eventParser->saveVenuesCsv("../../data/venues.csv");
// $eventParser->saveEventsCsv("../../data/events.csv");


// ============================ HTML OUTPUT SECTION ===========================
// Comment me out and use json_encode instead
// $prev_month = "";
// $prev_wkday = "";

// $php_events_array = $eventParser->getEvents();
// echo '<span class="small">';
// foreach ($php_events_array as $show) {
// 	//$nice_date = date("D M d", strtotime($show["date"]));
// 	$weekday 	= date("l", strtotime($show["fmt_date"]));
// 	$month 		= date("F", strtotime($show["fmt_date"]));

// 	// Monthly header
// 	if ($prev_month!=$month ) {											
// 		echo "<hr><h2>".$month." ".$show["year"]."</h2>";
// 	}	

// 	// Day of week header
// 	if ($prev_wkday!=$weekday) {								
// 		echo "<h3>".$show["nice_date"]."</h3>";
// 	}	
// 		echo ' <a href="'.$show['url'].'">'.$show['artist'].'</a> '.$show['venue'].'<br>';
// 	$prev_month	= $month;
// 	$prev_wkday = $weekday;
// }// End foreach
// echo '</span>';
//============================================================================ 

?>
