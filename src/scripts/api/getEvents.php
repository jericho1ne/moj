<?php
include_once('../common/common.php');
include_once('EventParser.php');

// require_once("db/__db_upd.php");
// require_once("db/__db_connex.php");
// require_once("Geocoder.php");
//============================================================

// Current (potentially outdated JSON data)
$jsonFile = "../../data/events.json";
$rawJson = json_decode(file_get_contents($jsonFile));
$hrsElapsed = 999;

if (isset($rawJson->timestamp)) {
	// Find out time elapsed in hours - formerly was using filemtime($jsonFile)
	$hrsElapsed = (time() - $rawJson->timestamp) / (60*60);
}

// Check JSON events file timestamp, 
// only grab new data if stale AND the file is writable
//if ($hrsElapsed > 12 && is_writable($jsonFile)) {
	// Constructor automatically calls parseURL
	$eventParser = new EventParser('http://thescenestar.typepad.com/shows/');

	echo ">>>>>>>>>>>>";
	// Format the data as JSON, save file in data directory
	// $json_events = $eventParser->getEventsJson();
	// $eventParser->saveJsonToFile('events', $jsonFile);

	// Also print out to screen, to satisfy the $.ajax call
	echo $json_events;
//}
// Data still fairly recent, Use cached file
// //}

// Save to CSV (if necessary)
// $eventParser->saveVenuesCsv("../../data/venues.csv");
// $eventParser->saveEventsCsv("../../data/events.csv");
