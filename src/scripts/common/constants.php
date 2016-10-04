<?php
// Database
define("LIMIT_SELECT", 100);
//define("HOST","localhost");
define("HOST","127.0.0.1");
define("DATABASE", "uzabl_middleofjune");

//
// Misc
//

// Get the base url of the webapp (used in getEvents.php)
define("URL_ROOT", (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/');

// Defines the search radius for nearby venues
define("SEARCH_RADIUS_MIN", 1);
define("SEARCH_RADIUS_MAX", 20);

// DB query limit fallbacks
define("LIMIT_MAX_VENUES", 10);
define("LIMIT_MAX_SHOWS_PER_PAGE", 20);

// May not make use of this
define("GEOFENCE_RADIUS", 0.003);

// Set up a default user location pour moi.
define("USER_LAT", 34.0467 );		// West LA
define("USER_LON", -118.4610);


// API Keys
define("TEXASAM_APIKEY", "a7a8978e712a459ba95ffba37b289d6f");
?>
