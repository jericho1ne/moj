/**
 * @file constants.js Gobals, API keys, etc.
 * @author Mihai Peteu 
 * @copyright 2016 Middle of June.  All rights reserved.
 */
var CACHE = {};

// Geolocation globals
// West LA
var USER_LAT = 34.0467;
var USER_LON = -118.4610;

//{ API -----------------------------------------------------------------------
//  Last.fm
var LASTFM_API_KEY = 'a758322352fdb7d257db8760ed906b25';
var LASTFM_SHARED_SECRET = 'e6ea066c63c110254bb4878c0e7a079b';
var LASTFM_USERNAME = 'middleofjune';
var LASTFM_TOPTRACKS_LIMIT = '4';

// Youtube API globals
var YOUTUBE_API_KEY = 'AIzaSyCF4m5XE3VTOUzo8b10EstraU1depENiB4';
var YOUTUBE_API_KEY_NEW = 'AIzaSyCPUfuqVzH96ap4Qo9FXNTIk-Gatjf_nu4';
var YOUTUBE_PLAYLISTS = [
  'PLLtM6mCpibb-3jk6YbbaZtIBzcxAPxIIj',
  'PLLtM6mCpibb87Ee_bbDB11MXyDmjxh2e4'
];
var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/';
// ------------------------------------------------------------------- End API }


//
// Data
// 
var CALENDAR_DIV = 'calendar-content';
var ARTIST_ALIASES = {
  'House Of Vibe All-Stars': 'House of Vibe Allstars',
  'Bringin\' Down the House': 'Bringing Down The House',
};

// Need at least 12 for each hour of the day
var BG_PLATES = [ 
  'adujahmal.jpg',
  'avalon.jpg',
  'aztec.jpg',
  'backstage.jpg',
  'busta.jpg',
  'chaka.jpg',
  'dalston.jpg',
  'dalston2.jpg',
  'drums.jpg',
  'drummer.jpg',
  'intherange.jpg',
  'kingking.jpg',
  'moses.jpg',
  'nemesis.jpg',
  'ngoniba.jpg',
  'ozo.jpg',
  'rims.jpg',
  'roycecrowd.jpg',
  'roycepatio.jpg',
  'shiloh.jpg',
  'synth.jpg',
  'themint.jpg',
  'theruler.jpg',
  'weddingandfuneralband.jpg',
  'will.jpg',
];


//
// Misc
//

var DATATABLES_PAGE_LENGTH = 1000;

// Get the base url of the webapp (used in getEvents.php)
// define('URL_ROOT', (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/');

// Defines the search radius for nearby venues 
// If these live on the front end, shall we remove from backend?
/* define('SEARCH_RADIUS_MIN', 1);
define('SEARCH_RADIUS_MAX', 20);
define('LIMIT_MAX_VENUES', 10);

// May not make use of this
define('GEOFENCE_RADIUS', 0.003);
*/
