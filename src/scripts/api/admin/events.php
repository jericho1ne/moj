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
<input type="radio" name="action" value="getNewScenestarShows"> Get <b>Scenestar</b> Shows<br>
<input type="radio" name="action" value="getNewTicketflyEvents"> Get <b>Ticketfly</b> Shows<br>
<input type="radio" name="action" value="getNewExpLAevents"> Get <b>Experience LA</b> Events<br>

<input type="radio" name="action" value="getTicketFlyVenuesFromEvents"> <b>Ticketfly</b> Venues (from upcoming Events)<br>
<input type="radio" name="action" value="getTicketFlyVenues"> <b>Ticketfly</b> Venues<br>

<input type="radio" name="action" value="getSeatGeekVenues"> <b>SeatGeek</b> Venues<br>
<br>
<input type="checkbox" name="saveToDB" value="1"> Save to DB!<br>
<hr>
<input type="submit" name="submit" value="Hit it.">
<br>
</form>



<?php
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
		$boundaryDate = new DateTime();
		// Format for start date
		$startDate = $boundaryDate->format("Y-m-d");

		// Get shows from today onwards
		$existingEvents = $Events->getEventsFromDb('text', '', '10');
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
			// EXAMPles
			// http://www.experiencela.com/rss/feeds/xlaevents.aspx

			//	+	?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=2016-3-4&keyword=
			
			// Future Events (from startdate until whenever)
			//	+	?id=custom&region=&category=&type=&startdate=2016-3-3&enddate=&keyword=

			// Get events from today onwards
			$Events->parseExpLAxml('http://www.experiencela.com/rss/feeds/xlaevents.aspx?id=custom&region=&category=&type=&startdate=' . $today . '&enddate=&keyword=');
		}
		// Ticketfly events! 
		else if ($action === 'getNewTicketflyEvents') {
			$maxTicketFlyEventsToGrab = 2000;
			$url = "http://www.ticketfly.com/api/events/upcoming.json?" .
				"orgId=1&fieldGroup=light&city=Los%20Angeles&" .
				"maxResults=". $maxTicketFlyEventsToGrab;

			// Get events from today onwards
			$Events->parseTicketflyEvents($url);
		}
		// Ticketfly venues (from upcoming events only) 
		else if ($action === 'getTicketFlyVenuesFromEvents') {
			$maxResults = 2000;

			$urlEventsCustom = "http://www.ticketfly.com/api/events/upcoming.json?orgId=1&city=Los%20Angeles"
				. "&fields=venue.id,venue.name,venue.address1,venue.address2,venue.city,venue.stateProvince,"
				. "venue.postalCode,venue.url,venue.blurb,venue.urlFacebook,venue.urlTwitter,"
				. "venue.lat,venue.lng"
				. "&maxResults=" . $maxResults;

			// echo $urlEventsCustom; die;
			
			// Get venues from today onwards
			$Events->parseTicketflyVenuesFromEvents($urlEventsCustom);
		}
		// Ticketfly venues direct 
		else if ($action === 'getTicketFlyVenues') {
			$maxResults = 2000;
			$urlVenues = "http://www.ticketfly.com/api/venues/list.json"
				. "?city=Los%20Angeles&maxResults=" . $maxResults;

			// Get all venues in db.  ti-hee.
			$Events->parseTicketflyVenues($urlVenues);
		}
		else if ($action ==="getSeatGeekVenues") {
			$maxResults = 2000;
			$urlVenues = "https://api.seatgeek.com/2/venues?city=los+angeles&state=ca&per_page="  
				. $maxResults;

			// Get all venues in db.  ti-hee.
			$Events->parseSeatGeekVenues($urlVenues);
		}

		// Always do a dump to screen at the end - grab venues or events and print
		if (!in_array($action, array(
			'getTicketFlyVenues',
			'getTicketFlyVenuesFromEvents',
			'getSeatGeekVenues'))
			) {
			$eventsList = $Events->getEvents();
			// pr($eventsList);
		}
		else {
			$venueList = $Events->getVenues();
			
			pr("<b> Total # of Venues : " . count($venueList) . "</b><br>");
			foreach ($venueList as $venue) {
			 	pr($venue["name"]);
			}
		}
		
	}// End else

	// If Save to DB checkbox is checked
	if ($saveToDB) {

		// Save Events
		if (!in_array($action, array(
			'getTicketFlyVenues',
			'getTicketFlyVenuesFromEvents',
			'getSeatGeekVenues'))) {
			pr("<b> ... saving EVENTS to db... </b><hr>");
			// Save received events to DB, updating only if show link or title have changed
			$Events->saveEventsToDb($dblink);
		}
		// Save Venues
		else {
			// Insert/update Venues in database
			$Events->saveVenuesToDb($dblink);
		}
	}
}// End if dblink is set and there is a POST submit

?>

</body>
</html>
