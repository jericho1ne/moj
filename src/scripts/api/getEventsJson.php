<?php	
include_once('../common/common.php');
require_once("db/__db_upd.php");
require_once("db/__db_connex.php");
include_once('EventParser.php');

error_reporting(E_ALL);

// Create new EventParser
$Events = new EventParser($dblink);

// Get today's date (and time)
$boundaryDate = new DateTime();

// Format for start date
$startDate = $boundaryDate->format("Y-m-d");

// Set result to false by default
$success = false;

// Get shows from today onwards
$localEvents = $Events->getEventsFromDb("text", "", "60");


if (count($localEvents)) {
	$success = true;
}

// Prepackage data into an array first
// // echo json_encode
echo json_encode(utf8ize(
	array(
		'success' => $success,
		'events' => $localEvents
	)
));

?>
