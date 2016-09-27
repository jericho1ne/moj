<?php
require_once("../common/common.php");
require_once("db/__db_sel.php");
require_once("db/__db_connex.php");
include_once('EventParser.php');

// Do whatever it takes to grab a lat / lon to use as anchor
$maxResults = set($_POST['maxResults'])
	? $_POST['maxResults']
	: LIMIT_MAX_SHOWS_PER_PAGE;

// Get today's date (and time)
$boundaryDate = new DateTime();

// Format for start date
$startDate = $boundaryDate->format("Y-m-d");

// Set result to false by default
$success = false;

// Get shows from today onwards.  
// Pass in:  format, startDate (defaults to today), max days ahead
$localEvents = EventParser::getEventsFromDb(
	$dblink, 
	[
		'format' => 'text', 
		'startDate' => '', 
		'maxResults' => $maxResults, 
		'fieldSet' => 'medium'
	]
);

if (count($localEvents)) {
	$success = true;
}

// Prepackage data into an array first
echo json_encode(utf8ize(
	array(
		'success' => $success,
		'events' => $localEvents
	)
));

// // Search for shows on the following date
// $show_date = date("Y-m-d");

// $query = 
// 	"SELECT events.*, venues.lat, venues.lon, venues.city, " . 
// 	"'-1' AS distance, " .
// 	"DATE_FORMAT(events.ymd_date,'%a %M %e') AS nice_date " .
// 	"FROM events " . 
// 	"INNER JOIN venues ON events.venue IN (venues.name, venues.alias_1, venues.alias_2) " .
// 	"WHERE ymd_date >= '{$show_date}' " .
// 	"AND media != '' " .
// 	"GROUP BY events.eventid " .
// 	"ORDER BY ymd_date ASC " .
// 	"LIMIT " . $maxResults;

// // $dblink is created in include/_db_connex.php
// $statement = $dblink->prepare($query);

// // Execute query, fetching results by associative index
// $statement->execute();
// $results = $statement->fetchAll(PDO::FETCH_ASSOC);

// echo json_encode($results);
?>
