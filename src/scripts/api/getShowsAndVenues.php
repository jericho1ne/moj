<?php
require_once("../common/common.php");
require_once("db/__db_sel.php");
require_once("db/__db_connex.php");


// Do whatever it takes to grab a lat / lon to use as anchor
if (set($_POST['lat']) && set($_POST['lon']) && set($_POST['maxResults'])) {
	$userLat = $_POST['lat'];
	$userLon = $_POST['lon'];
	$max 	 = $_POST['maxResults'];
}
else if (set($_GET['lat']) && set($_GET['lon']) && set($_GET['maxResults'])) {
	$userLat = $_GET['lat'];
	$userLon = $_GET['lon'];
	$max 	 = $_GET['maxResults'];
}
else {
	$userLat = USER_LAT;
	$userLon = USER_LON;
	$max 	 = LIMIT_MAX_VENUES;
}

// DEBUG
// pr($userLat . ' / ' . $userLon . ' / ' . $max);

// TODO: sanitize lat / lon?

// Where we'll store any place within a X mile radius
$nearbyPlaces = array();

// Set db query
//$query = "SELECT * FROM `venues`";

// Search for shows on the following date
$show_date = date("Y-m-d");

$query = 
	"SELECT events.*, venues.lat, venues.lon, venues.city, " . 
	"DATE_FORMAT(events.ymd_date,'%a %M %e') AS nice_date " .
	"FROM events " . 
	"INNER JOIN venues ON events.venue IN (venues.name, venues.alias_1, venues.alias_2) " .
	"WHERE ymd_date = '{$show_date}' " .
	"GROUP BY events.eventid";

// $dblink is created in include/_db_connex.php
$statement = $dblink->prepare($query);

// Execute query, fetching results by associative index
$statement->execute();
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

// Parse through results tagging each venue with proximity from user
foreach ($results as $row) {
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

	// Append distance column, add to nearbyPlaces list
	$row["distance"] = $distance;
	array_push($nearbyPlaces, $row);

	// If we want to limit results
	//if($distance <= $some_passed_in_distance {
	//			array_push($placeList, $thisPlace);
	//}
	// DEBUG
	// pr($row['name'] . ' - ' . $distance);
}// End foreach parse through db results

// sort place array, distance ascending;
// ensures we get only places within our radius;
// will have to order again in front end
usort($nearbyPlaces, function($a, $b) {
    return $b['distance'] > $a['distance'] ? 1 : -1;
});

$nearbyPlaces = array_reverse($nearbyPlaces);
$nearbyPlaces = array_slice($nearbyPlaces, 0, $max);    //  truncate the nearby places

//DEBUG
// pr($nearbyPlaces);

echo json_encode($nearbyPlaces);
?>
