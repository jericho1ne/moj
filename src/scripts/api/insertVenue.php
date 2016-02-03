<?php
require_once("../common.php");
require_once("db/_db_upd.php");
require_once("db/_db_connex.php");
require_once("Geocoder.php");

// $dblink is created in include/_db_connex.php
/*
$results = $dblink->query('SELECT * FROM venues LIMIT '.LIMIT_SELECT);
foreach($results as $row) {
// 	pr($row);
}
*/

$fh = fopen('../../data/top-100-venues.txt','r');
$break_after = 10;
$count = 0;

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

	// echo $v_name ." - ". $v_addy . " - ". $v_city . " - " . $v_zipc. " <br>";

	// TODO:  avoid gecode if the venue's lat/lon already exists in db!
	// 			where does this function get placed?  Geocode.php becomes a class!
	// eg if(!venueExists()) {}
	// 		venueExists --return if !venue_name || venue_name && (lat='' || lon='')

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
		/*
		"INSERT INTO venues SET
			username = :username,
			first_name = :first_name,
			last_name = :last_name";

		$stmt->bindParam("username", $this->username);
		$stmt->bindParam("first_name", $this->first_name);
		$stmt->bindParam("last_name", $this->last_name);

		$query =
		*/

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

/*
  $query  = '';
  $result = mysql_query($query);

  $venuesList =  array();

  while ($row = mysql_fetch_assoc($result) ) {
	print_r($row);
	// array_push( $venuesList, $row);
  }

  // echo json_encode( $venuesList );
  */
?>
