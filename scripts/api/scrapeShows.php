<?php
include_once('../common/common.php');
include_once('EventParser.php');

//============================================================
$eventParser = new EventParser('http://thescenestar.typepad.com/shows/');

$json_events = $eventParser->getEventsJson();
$php_events_array = $eventParser->getEvents();

$eventParser->saveJsonToFile('events', "../../data/events.json");

$eventParser->saveVenuesCsv("../../data/venues.csv");
$eventParser->saveEventsCsv("../../data/events.csv");

/*
TODO:  add youtube autosearch link for each artist!
	EG:  www.youtube.com/results?search_query=bubu+gang
*/
// ============================ OUTPUT SECTION ===========================
$prev_month = "";
$prev_wkday = "";

echo '<span class="small">';

foreach ($php_events_array as $show) {
	//$nice_date = date("D M d", strtotime($show["date"]));
	$weekday 	= date("l", strtotime($show["fmt_date"]));
	$month 		= date("F", strtotime($show["fmt_date"]));

	// Monthly header
	if ($prev_month!=$month ) {											
		echo "<hr><h2>".$month." ".$show["year"]."</h2>";
	}	

	// Day of week header
	if ($prev_wkday!=$weekday) {								
		echo "<h3>".$show["nice_date"]."</h3>";
	}	
		echo ' <a href="'.$show['url'].'">'.$show['artist'].'</a> '.$show['venue'].'<br>';
	$prev_month	= $month;
	$prev_wkday = $weekday;
}//
echo '</span>';

//============================================================================ JSON
//   echo $json_events;
?>