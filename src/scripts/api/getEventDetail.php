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

// // Format for start date
// $startDate = $boundaryDate->format("Y-m-d");

// Set result to false by default
$success = false;

// TODO: Sanitize input!
$event_id = intval($_POST['eid']);
// $event_id = "768";

// Get detailed show info for the given event id 
$eventDetail = $Events->getSingleEventFromDb($event_id);

if (count($eventDetail)) {
	$success = true;
}

// Prepackage data into an array first
// // echo json_encode
echo json_encode([
	'success' => $success,
	'events' => $eventDetail
]);

// FORMAT
/* 
{
    "success": true,
    "events": [
        {
            "e_id": "13421",
            "d_ymd": "2016-05-24",
            "d_fmt": "Tue May 24",
            "d_upd": "2016-05-22 15:47:13",
            "type": "Music",
            "a": "The Muffs Live Performance & Signing - Free & All Ages",
            "v": "Amoeba Music",
            "t": "The Muffs @ Ameoba",
            "prc": "free",
            "url": "http://www.experiencela.com/calendar/event/69947"
        },
        {
            "e_id": "13422",
           	...
        }
    }// End events
}
*/

?>
