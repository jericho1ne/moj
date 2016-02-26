<?php	
include_once('../common/common.php');
require_once("db/__db_upd.php");
require_once("db/__db_connex.php");
include_once('EventParser.php');

// Create new EventParser
$Events = new EventParser($dblink);

// Get today's date (and time)
$cutoffDate = new DateTime();

// Nudge date (forward or back) if need be
// $cutoffDate->modify("+30 days");

$date = $cutoffDate->format("Y-m-d");

// Set result to false by default
$success = false;

// Get shows from today onwards
$localEvents = $Events->getEventsFromDb('', $date);

if (count($localEvents)) {
	$success = true;
}

// Prepackage data into an array first
echo json_encode(array(
	'success' => $success,
	'events' => $localEvents
));

?>
