<?php
require_once("../common/common.php");
require_once("db/__db_sel.php");
require_once("db/__db_connex.php");
include_once('EventParser.php');

// Get today's date (and time)
$defaultDate = new DateTime();

// Start date is always expected
$startDate = set($_POST['startDate'])
	? $_POST['startDate']
	: $defaultDate->format("Y-m-d");

// Fieldset determines how detailed the result set should be
$fieldSet = set($_POST['fieldSet'])
	? $_POST['fieldSet']
	: 'light';

// Pass in:  format, startDate (defaults to today)
$options = [
	'startDate' => $startDate, 
	'endDate' => set($_POST['endDate']),
	'format' => 'text', 
	'fieldSet' => 'medium',
	'maxResults' => set($_POST['maxResults']),
	//'mediaOnly' => true,
];

// Get shows from start date to end date  
$localEvents = EventParser::getEventsFromDb($dblink, $options);

$success = (count($localEvents)) ? true : false;

// Prepackage data into an array first
echo json_encode([
	'success' => $success,
	'timestamp' => date("Y-m-d H:i:s"),
	'events' => $localEvents
]);

/* query = 
SELECT events.eventid, events.source, events.ymd_date, events.type, events.artist, events.venue, events.title, events.slug, events.price, events.url, events.media, venues.city, venues.neighborhood 
	FROM events 
INNER JOIN venues 
	ON events.venue IN (venues.name, venues.alias_1, venues.alias_2) 
WHERE 
	ymd_date >= '2016-10-17' 
	AND events.ymd_date < '2016-11-22' 
	AND events.media != '' 
GROUP BY events.eventid 
ORDER BY 
	events.ymd_date ASC, 
	events.type='Live Show' DESC, 
	events.updated DESC 
LIMIT 100
*/
?>
