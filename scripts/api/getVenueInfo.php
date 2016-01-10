<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../include/_constants.php");
require_once("../include/common.php");
require_once("../include/_db_sel.php");
require_once("../include/_db_connex.php");
require_once("../include/Geocode.php");

// $dblink is created in include/_db_connex.php

pr($_POST);

// TODO: sanitize and only run the query if not blank
$queryName = isset($_POST['venue_name']) ;
$queryName = 'avalon';


$results = $dblink->query(
    "SELECT * FROM `venues`
    WHERE '{$queryName}' IN (name, alias_1, alias_2, alias_3)");

foreach($results as $row) {
  pr($row);
}


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
