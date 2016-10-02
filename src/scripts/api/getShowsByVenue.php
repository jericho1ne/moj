<?php
require_once("../common/common.php");
require_once("db/__db_sel.php");
require_once("db/__db_connex.php");
include_once('EventParser.php');


// Get today's date (and time)
$defaultDate = new DateTime();


/**
 * SET DEFAULTS IF VALUES NOT PROVIDED
 * - maxResults: limits the query
 * - startDate: sets a specific start date 
 * - daysChange: 
	 */
$maxResults = set($_POST['maxResults'])
	? $_POST['maxResults']
	: LIMIT_MAX_SHOWS_PER_PAGE;

$startDate = set($_POST['startDate'])
	? $_POST['startDate']
	: $defaultDate->format("Y-m-d");

$daysChange = set($_POST['daysChange'])
	? $_POST['daysChange']
	: 0;

// $maxResults = 50;

if ($daysChange != 0) {
	$startDate = date(
		'Y-m-d', 
		strtotime($startDate. "+" . (int)$daysChange . " days")
	);
}

// Set result to false by default
$success = false;

// Get shows from today onwards.  
// Pass in:  format, startDate (defaults to today)
$localEvents = EventParser::getEventsFromDb(
	$dblink, 
	[
		'format' => 'text', 
		'startDate' => $startDate, 
		'maxResults' => $maxResults,
		'daysChange' => $daysChange,
		'fieldSet' => 'medium'
	]
);

if (count($localEvents)) {
	$success = true;
}

// Prepackage data into an array first
echo json_encode([
	'success' => $success,
	'events' => $localEvents
]);

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
