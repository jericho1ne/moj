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
	"'-1' AS distance, " .
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

// Parse through results adding a blank 
// foreach ($results as $row) {
// 	//pr($row);
// }
echo json_encode($results);
?>
