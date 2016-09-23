<?php
require_once("../common/common.php");
require_once("db/__db_sel.php");
require_once("db/__db_connex.php");


// Do whatever it takes to grab a lat / lon to use as anchor
$maxResults = set($_POST['maxResults'])
	? $_POST['maxResults']
	: LIMIT_MAX_SHOWS_PER_PAGE;


// Where we'll store any place within a X mile radius
$nearbyPlaces = array();

// Search for shows on the following date
$show_date = date("Y-m-d");

$query = 
	"SELECT events.*, venues.lat, venues.lon, venues.city, " . 
	"DATE_FORMAT(events.ymd_date,'%a %M %e') AS nice_date " .
	"FROM events " . 
	"INNER JOIN venues ON events.venue IN (venues.name, venues.alias_1, venues.alias_2) " .
	"WHERE ymd_date = '{$show_date}' " .
	"GROUP BY events.eventid " .
	"ORDER BY ymd_date ASC " .
	"LIMIT " . $maxResults;

// $dblink is created in include/_db_connex.php
$statement = $dblink->prepare($query);

// Execute query, fetching results by associative index
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

// Parse through results tagging each venue with proximity from user
foreach ($results as $row) {
	//pr($row);

	/*

	$current_venue_latlon  = array(
		"lat"=> $row["lat"],
		"lon" => $row["lon"]
	);

	// user position, venue position, geofence radius
	$distance = calculateDistance(
		array(
			"lat" => $userLat,
			"lon" => $userLon
		),
		$current_venue_latlon,
		GEOFENCE_RADIUS
	);// End distance = calcDist

	*/ 

}// End foreach parse through db results


echo json_encode($results);
?>
