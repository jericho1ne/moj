<?php
echo getcwd();
require_once('../scripts/common/common.php');
require_once("../scripts/api/db/__db_upd.php");
require_once("../scripts/api/db/__db_connex.php");
require_once('../scripts/api/EventParser.php');
?>

<!doctype html><html class="no-js" lang="">
<head><meta charset="utf-8">
<title>Middle Of June - Admin</title>
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<!-- MoJ custom styles and overrides -->
<style>
body { 
	background-color: rgba(121, 139, 96, 0.18);
	font-family: Helvetica, Arial;
    color: #434141;
    font-weight: 100;
    font-variant: normal;
    letter-spacing: 0.5px;
    font-size: 14px;
}
input.button { 
	/* transform: scale(1.2); */
	padding: 12px; 
	border: 1px solid black; 
	font-size: 16px;
}
input[type='radio'], input[type='checkbox'] { 
	transform: scale(1.25);
    margin: 7px 5px 5px 10px;
    vertical-align: baseline;
}
</style>
</head>

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
<br>
<input type="radio" name="action" value="getNewScenestarShows"> Get <b>Scenestar</b> Shows<br>
<input type="radio" name="action" value="getNewTicketflyEvents"> Get <b>Ticketfly</b> Shows<br>
<!-- <input type="radio" name="action" value="getNewExpLAevents"> Get <b>Experience LA</b> Events<br> -->
<br>
<input type="radio" name="action" value="getTicketFlyVenuesFromEvents"> <b>Ticketfly</b> Venues (from upcoming Events)<br>
<input type="radio" name="action" value="getTicketFlyVenues"> <b>Ticketfly</b> Venues<br>

<input type="radio" name="action" value="getSeatGeekVenues"> <b>SeatGeek</b> Venues<br>
<br>
<input type="checkbox" name="saveToDB" value="1"> Save to DB!<br>
<hr>
<input type="submit" name="submit" class="button" value="Hit it.">
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

// If submit button was clicked
if ($dblink && $action !== "") {
	// Create new EventParser	
	$Events = new EventParser($dblink);

	// Grab shows saved in DB
	if ($action === 'getExistingShows') {
		$boundaryDate = new DateTime();
		// Format for start date
		$startDate = $boundaryDate->format("Y-m-d");

		// Pass in:  format, startDate (defaults to today)
		$options = [
			'startDate' => $startDate, 
			 //'endDate' => '',
			'format' => 'text', 
			'fieldSet' => 'medium',
			'maxResults' => 9999,
		];

		// Get shows from today onwards
		$existingEvents = EventParser::getEventsFromDb($dblink, $options);
		pr($existingEvents);
	} else {
		// Figure out today's date 
		$today = date('Y-n-j');

		// Scrape Scenestar
		if ($action === 'getNewScenestarShows') {
			$maxResults = 2000;
			// Get newest shows
			$Events->parseScenestarEvents('http://thescenestar.typepad.com/shows/', $maxResults);		
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
			
			$customParams = [
				'startDate',
				'venue.id',
				'venue.name',
				'venue.address1',
				'ageLimit',
				'headlinersName',
				'supportsName',
				'headliners.image.large',
				'headliners.eventDescription',
				// If a paid event
				'ticketPurchaseUrl',
				// If a free event, fall back upon this, it'll always be there
				'urlEventDetailsUrl',
				'ticketPrice'
			];

			// ORIGINAL:  
			// 	"orgId=1&fieldGroup=light&city=Los%20Angeles&maxResults=". $maxTicketFlyEventsToGrab;
			
			$url = "http://www.ticketfly.com/api/events/upcoming.json?" .
				"orgId=1&city=Los%20Angeles" .
				"&fields=" . implode($customParams, ',') .
				"&maxResults=". $maxTicketFlyEventsToGrab;
		
		echo $url . '<hr>';

			// Get events from today onwards
			$Events->parseTicketflyEvents($url);
		}
		// Ticketfly venues (from upcoming events only) 
		else if ($action === 'getTicketFlyVenuesFromEvents') {
			$maxResults = 2000;

			$customParams = [
				'venue.id',
				'venue.name',
				'venue.address1',
				'venue.address2',
				'venue.city',
				'venue.stateProvince',
				'venue.postalCode',
				'venue.url',
				'venue.blurb',
				'enue.urlFacebook',
				'venue.urlTwitter',
				'venue.lat',
				'venue.lng'
			];
	
			$urlEventsCustom = 'http://www.ticketfly.com/api/events/upcoming.json?orgId=1&city=Los%20Angeles'
				. '&fields=' . implode($customParams, ',')
				. '&maxResults=' . $maxResults;

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
			
			foreach ($eventsList as $evt) {
				pr($evt['ymd_date'] . ' | ' . $evt['source'] . ' | ' 
					. $evt['type'] . ' | ' 
					. $evt['artist'] . ' | ' . $evt['venue'] . ' -- ' 
					. $evt['title'] . ' $[' . $evt['price'] . ']'
					. '<br>'
					. $evt['url'] . '<br>' . $evt['media'] . '<br>'
					. $evt['description'] . '<hr>');
			}
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
			pr("<b> ... saving VENUES to db... </b><hr>");
			// Save received events to DB, updating only if show link or title have changed
			$Events->saveEventsToDb($dblink);
		}
		// Save Venues
		else {
			pr("<b> ... saving EVENTS to db... </b><hr>");
			// Insert/update Venues in database
			$Events->saveVenuesToDb($dblink);
		}
	}// End if Save to DB

}// End if dblink is set and there is a POST submit

?>

</body>
</html>
