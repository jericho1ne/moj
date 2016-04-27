<?php
include_once('../../common/common.php');
require_once("../db/__db_upd.php");
require_once("../db/__db_connex.php");
include_once('../EventParser.php');
?>

<html>
<body>

<?php
// Get total number of shows from today onwards
$upcomingQuery  = "SELECT * FROM events WHERE ymd_date >= CURDATE()";
$results = $dblink->query($upcomingQuery);
echo " Upcoming events in DB: <b>" . $results->rowCount() . "</b><br><br>";
?>

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



<?
//============================================================

// Automatically get fresh data when time elapsed exceeds $hrsElapsed
// $hrsElapsed = 12;
// if (isset($rawJson->timestamp)) {
// 	// Find out time elapsed in hours - formerly was using filemtime($jsonFile)	
// }
// $hrsElapsed = (time() - $rawJson->timestamp) / (60*60);

//
//  POST action
//  
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
		$existingEvents = $Events->getEventsFromDb('text', $date);

		pr($existingEvents);
	}
	else {
		// Figure out today's date for ExpLA and Ticketfly (format 2016-1-1)
		$today = date('Y-n-j');

		// Scrape Scenestar
		if ($action === 'getNewScenestarShows') {
			// Get newest shows
			$Events->parseScenestarEvents('http://thescenestar.typepad.com/shows/');		
		}
		// Experience LA
		else if ($action === 'getNewExpLAevents') {
			$url = "http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=2016-3-4&keyword=";
			
			$allFutureEventsUrl = "http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=&keyword=";

			// Get events from today onwards
			$Events->parseExpLAxml('http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=' . $today . '&enddate=&keyword=');
		}
		// Ticketfly! 
		else if ($action === 'getNewTicketflyevents') {
			$url = "http://www.ticketfly.com/api/events/upcoming.json?orgId=1&fieldGroup=light&city=Los%20Angeles&maxResults=2000";

			// Get events from today onwards
			$Events->parseTicketflyEvents($url);
			// $eventsList = $Events->getEvents();
		}
		// Always do a dump to screen at the end - grab events and print
		$eventsList = $Events->getEvents();
		pr($eventsList);
	}// End else

	// If Save to DB checkbox is checked
	if ($saveToDB) {
		//pr($eventsList);

		// Save received events to DB, updating only if show link or title have changed
		$Events->saveEventsToDb($dblink);
	}
}// End if dblink is set and there is a POST submit

?>

</body>
</html>
