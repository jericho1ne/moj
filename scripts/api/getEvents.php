<?php

/*
getEvents.php

Runs as a cron job and/or
is called up when the JSON events file timestamp is stale q

TODO:  - naming convention between 
	- getEvents 
	- displayEvents
	- saveEvents (user-submitted, v2.0)

*/
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../common/common.php");
require_once("db/__db_upd.php");
require_once("db/__db_connex.php");
require_once("Geocoder.php");


// $dblink is created in include/_db_connex.php
$localPrefix = '';

if (strpos(URL_ROOT, "localhost") !== -1)
    $localPrefix = 'middleofjune/dist/';


$fh = fopen(URL_ROOT . $localPrefix . '/data/top-100-venues.txt','r');


while ($line = fgets($fh)) {
	pr($line);
};


/*
$break_after = 10;
$count = 0;

echo URL_ROOT . 'data/top-100-venues.txt';



*/
/*

while ($line = fgets($fh)) {
	// split up CSV on comma boundary
	$venue_chunks = explode(",", $line);
	//echo $line."<hr>";

	// Map Venue name, Address, City and Zip
	// Scrub out leading/trailing whitespace
	$v_name = trim($venue_chunks[0]);
	$v_addy = trim($venue_chunks[1]);
	$v_city = trim($venue_chunks[2]);

	// Strip out the state abbrev (if found)
	$v_zipc = trim(str_replace("CA", "", $venue_chunks[3]));

	$geoResult = geocodeFullAddress(
		array(
			"addy" => $v_addy,
			"city" => $v_city,
			"zipc" => $v_zipc,
		)
	);

	//
	if ($geoResult["success"]) {
		pr($geoResult["payload"]);

		// Prepare insert query
		$statement = $dblink->prepare(
			"INSERT INTO venues(name, address, city, zip, lat, lon) ".
   			"VALUES(:name, :address, :city, :zip, :lat, :lon) ".
   			"ON DUPLICATE KEY UPDATE lat= :lat2, lon= :lon2");

		$statement->execute(array(
			"name" => $v_name,
			"address" => $v_addy,
			"city" => $v_city,
			"zip"  => $v_zipc,
			"lat" => $geoResult["payload"]["lat"],
			"lon" => $geoResult["payload"]["lon"],
			"lat2" => $geoResult["payload"]["lat"],
			"lon2" => $geoResult["payload"]["lon"]
		));

	}

	if ($count >= 9)
		break;

	$count++;
}
fclose($fh);
*/
?>
