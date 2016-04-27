<?php
// SET DEFAULTS
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('America/Los_Angeles');

// Let's not forget the constants
require_once("__constants.php");


//------------------------------------------------------------------------------
//  Name:     set
//  Purpose:  silently fails when trying to echo an empty string
//------------------------------------------------------------------------------
function set(& $var) {
	if (isset($var))
		return $var;
	else
		return "";
}

//------------------------------------------------------------------------------
//  Name:     pr
//  Purpose:  formats arrays into readable text
//------------------------------------------------------------------------------
function pr($data) {
	echo "<PRE>"; print_r($data); echo "</PRE>";
}

//============================================================
//  Name:    calculateDistance
//  Purpose: return distance between two points in miles
//============================================================
function calculateDistance($point1, $point2, $geofence_radius) {
//echo "<pre>"; print_r($point2); echo "</pre>";

	// if gf_radius is zero in db, use our global value
	if ( $geofence_radius==0 ) {
		global $_GEOFENCE_RADIUS;
		$geofence_radius = $_GEOFENCE_RADIUS;
	}

	//$radius = 6371; // Radius of the earth in km
	$radius = 3958.761; // Radius of the earth in mi

	// deg2rad is a predefined php function
	$diff_lat = deg2rad( floatval($point2['lat']) - floatval($point1['lat']));
	$diff_lon = deg2rad( floatval($point2['lon']) - floatval($point1['lon']));

	$a =
		sin( $diff_lat/2 ) * sin( $diff_lat/2 ) +
		cos( deg2rad(floatval($point1['lat'])) ) *
		cos( deg2rad(floatval($point2['lat'])) ) *
		sin( $diff_lon/2 ) * sin( $diff_lon/2 );

	$c = 2 * atan2( sqrt($a), sqrt( 1 - $a) );
	$distance = ( $radius * $c ) - $geofence_radius;
	// inside the geofence radius, that means super close
	if ($distance == 0 || $distance < 0) {
		$distance = 0;
	}
	return round($distance, 2);
}// End calculateDistance

//============================================================
//  Name:    intAsText($number)
//  Purpose: return textual representation of a number
//            only works with 0-9!
//============================================================
function intAsText ($number) {
	$integers_as_text = array(
		'0'=>'zero',
		'1'=>'one',
		'2'=>'two',
		'3'=>'three',
		'4'=>'four',
		'5'=>'five',
		'6'=>'six',
		'7'=>'seven',
		'8'=>'eight',
		'9'=>'nine'
	);
	return strtr($number, $integers_as_text);
}// End intAsText

//============================================================
//  Name:    timeElapsed
//  Purpose: return human readable time passed
//============================================================
function timeElapsed ($time) {
// calculate time between Now and Then
$timeDiff = strtotime("now") - strtotime($time);
	if ($timeDiff < 0) {
		$timeDiff *= -1;
	}

	$tokens = array (
		31536000 => 'year',
		2592000 => 'month',
		604800 => 'week',
		86400 => 'day',
		3600 => 'hour',
		60 => 'minute',
		1 => 'second'
	);

	foreach ($tokens as $unit => $text) {
		if ($timeDiff < $unit) {
			 continue;
		}
		$numberOfUnits  = floor($timeDiff / $unit);
		$fmt_time       = $numberOfUnits.' '.$text.(($numberOfUnits>1)?'s ago':' ago');
		$raw_minutes    = floor($timeDiff/60);
		// TODO: return array instead ( "fmt_time"=>$fmt_time, "raw_mins"=>$raw_mins )
		return array( "fmt_time"=>$fmt_time, "raw_mins"=>$raw_minutes );
	}
}// End timeElapsed

/**
* throwError description
* @param  [type] $errno      [description]
* @param  [type] $errstr     [description]
* @param  [type] $errfile    [description]
* @param  [type] $errline    [description]
* @param  array  $errcontext [description]
* @return [type]             [description]
*/
function throwError($errno, $errstr, $errfile, $errline, array $errcontext) {
	// error was suppressed with the @-operator
	if (0 === error_reporting()) {
		return false;
	}
	throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}// End throwError

/**
* Check whether a remote file exists based on http response code
* @param  string $url Remote file url
* @return bool True (if 200) or False (if 404, etc)
*/
function remoteFileExists($url) {
	$headers = get_headers($url);
	$responseCode = substr($headers[0], 9, 3);

	echo $responseCode . "<br>";

	if ($responseCode != "200") {
		return false;
	}
	else {
		return true;
	}
}// End remoteFileExists


?>
