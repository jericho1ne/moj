<?php
class EventParser {

	//
	// PROPERTIES
	//
	private $venueArray = array();
	private $eventArray = array();
	private $today_formatted;    // formatted as Scenestar likes it
	private $trrow_formatted;    // formatted as Scenestar likes it
	private $url;

	//
	// METHODS - parse and save to class properties
	//

	/*
	*	__construct( url_to_parse )
	*	save incoming URL, scrape some live show data
	* 	@param string $url
	**/
	public function __construct($url) {
		// Get today and tomorrow's date with leading zeros for month and day
		$this->today_formatted = date('m.d.y');
		$today = date('Y-m-d');
		$this->trrow_formatted = date('m.d.y', strtotime($today . "+1 days"));

		// TODO:  abstract final formatting logic, break up into different parsers
		//	eg: Flavorpill, LA Weekly, Enclave LA, Songkick, etc
		$this->parseUrl($url);			// build up array of live music events, save to events array
		return $this->eventArray;
	}

	/**********************************************************************************
		checkFileStatus($file)
		if file does not exist, create an empty one!
	*********************************************************************************/
	public function checkFileStatus($file) {
		if ( !file_exists($file) ) {
			$fp = fopen($file,"wb");
			fwrite($fp,"");
			fclose($fp);
		}
	}

	/**********************************************************************************
		parseUrl( $url )
		fill in the eventArray & venueArray
	*********************************************************************************/
	public function parseUrl($url) {
		// Search for shows beginning with today's date
		$searchDate = $this->today_formatted;

		// Ingest webpage source
		$source = file_get_contents($url);							

		// If time is nearing midnight, we may get no results
		// Therefore, grab next day's shows (d+1)
		if (strpos($source, $this->today_formatted) === -1) {
			$searchDate = $this->trrow_formatted;
		}
		
		// Look for our start date, mark as entry point
		$start = strpos($source, $searchDate);	
		// find the end marker (this *may* change every so often)	
		$end = strpos($source, '<div id="gamma">');	
		// find character length up to the end marker
		$data_size = $end - $start;		
		// grab only the repeated, relevant show data							
		$rough_chunk = substr($source, $start-1, $data_size);	

		// get rid of funky characters like <®> or <â€™>
		$rough_chunk = html_entity_decode($rough_chunk, ENT_QUOTES, "UTF-8");
		$rough_chunk = str_replace('’',"'", $rough_chunk);
		$rough_chunk = str_replace('®',"", $rough_chunk);
		$rough_chunk = str_replace('ó',"o", $rough_chunk);

		$break_point = '<tr>';
		$lines = explode($break_point, $rough_chunk);      // break up table rows into lines (strings)

		$future_max_date = strtotime(date('Y-m-d') . ' +10 week');
		$future_max_date = date('Y-m-d', $future_max_date );

		$json_data = array();
		$count = 0;
		$venues = array();	// will temporarily store all venues

		foreach ($lines as $val) {
			
			// Extract date of show using regular expressions
			// [0-9]{2}.[0-9]{2}.[0-9]{2}  << pattern to look for (eg 01.31.2013)

			// if there's no date, then ignore the whole line
			if (preg_match('/[0-9]{2}.[0-9]{2}.[0-9]{2}/', $val, $matches)) {
				$date = $matches[0];
				$dateArray = explode(".", $date);

				// For whatever reason, the full date wasn't captured, assume bad input and skip
				if (sizeof($dateArray) != 3) {
					// echo (" >> Skipping - Bad Input ");
					// pr($matches);
					continue;
				}

				// Date gets formatted
				$fmt_date = "20" . $dateArray[2] . "-" . $dateArray[0] . "-" . $dateArray[1];
				$show_year = "20" . $dateArray[2];
				// stop if over our set date boundary (1 or 2 weeks ahead, etc)
				if ($future_max_date < $fmt_date) {
					break;
				}

				$month = date("F", strtotime($fmt_date));

				// Extract show URL (hint: '<a href=' >> 'target="_blank"')
				$url_start_pos = strrpos($val, '<a href=');
				$url_end_pos   = strrpos($val, '" target="_blank"');
				$url_length = $url_end_pos - $url_start_pos;
				$url   = trim(substr($val, $url_start_pos+9, $url_length-9));

				// Extract artist name (hint: 'target="_blank"' >> '@')
				$from = 'target="_blank" />';
				$to   = '</a> @';
				$artist_start_pos = strrpos($val, $from);
				$artist_end_pos = strrpos($val, $to);
				$artist_length = $artist_end_pos - $artist_start_pos;
				$artist  = trim(substr($val, $artist_start_pos+strlen($from), $artist_length-18) );
				$artist = str_replace('"', '', $artist); 			// get rid of double quotes
				$artist = str_replace(',', '', $artist); 			// and commas too

				// Extract venue
				$venue = preg_match('/@ [A-z0-9&\',. ]*/', $val, $matches);			// allow for &, single quotes and commas in the venue name
				$venue = str_replace("@ ", "", $matches[0]);
				$venue = str_replace('"', '', $venue); 				// get rid of double quotes!
				$venue = str_replace(', ', '-', $venue);
				$venue = trim($venue);

				$nice_date = date( "l M j", strtotime($fmt_date) );
				$short_date = date( "D M j", strtotime($fmt_date) );

				$venues[$count] = $venue;

				$cal_date = strtotime($fmt_date).'000';

				// ********** DEBUG ******
				// Uncomment line below to see what the f is wrong
				// echo $fmt_date . " " . $artist . " @ " . $venue ."<br>";

				// Save all of our event info to the private class property (eventArray)
				array_push(
					$this->eventArray, 		
					array(
						"raw_date"	=> $cal_date,	// 1377738000000
						"fmt_date"	=> $fmt_date,	// 2020-12-01
						"nice_date"	=> $nice_date,	// Saturday Jun 15
						"short_date"=> $short_date,	// Sat Jun 15
						"year"		=> $show_year,
						"type"		=> "show",  		// TODO: find out if needed for Event Calendar??
						"artist"	=> $artist,
						"venue"		=> $venue,
						"title"		=> $artist . " @ " . $venue,	// needed for Event Calendar!
						"url"		=> $url
					)
				);
				$count ++;
			}// End if preg_match
		}// End foreach lines

		// OUTSIDE of the foor loop, do this:
		$sortedVenues =  array_count_values($venues);
		arsort( $sortedVenues );
		$this->venueArray = $sortedVenues;
		// return $json_data;			// TODO:  should return TRUE (if eventsArray was hydrated) or FALSE (if error)
	}// End method parseUrl

	/**********************************************************************************
		saveEventsToFile( filename )
		dump JSON data to a file
	*********************************************************************************/
	public function saveJsonToFile($which, $file) {
		$this->checkFileStatus($file);
		if ($which=="events") {
			file_put_contents($file, 
				json_encode(
					array(
		 				'timestamp' => time(),
		 				'events' => $this->eventArray
		 			)
		 		)
			);
		}
		else if ($which=="venues") {
			file_put_contents($file, 
				json_encode(
					array(
			 			'timestamp' => time(),
			 			'events' => $this->venueArray
			 		)
			 	)
			);
		}
	}

	/**********************************************************************************
		getEvents()
		return event array and print to screen
	*********************************************************************************/
	public function getEvents() {
		// echo "<pre>"; print_r($this->eventArray); echo "</pre>";
		return $this->eventArray;
	}

	/**********************************************************************************
		getEventsJson()
		return event array in JSON format
	*********************************************************************************/
	public function getEventsJson() {
		// Return timestamp + data
		return json_encode(
		 	array(
		 		'timestamp' => time(),
		 		'events' => $this->eventArray
		 	)
		);
	}// End function getEventsJson

	/**********************************************************************************
		getVenues()
		return venues array and print to screen
	*********************************************************************************/
	public function getVenues() {
		// echo "<pre>"; print_r($this->venueArray); echo "</pre>";
		return $this->venueArray;
	}

	/**********************************************************************************
		saveVenuesCsv()
		duh, save to a CSV file
	*********************************************************************************/
	public function saveVenuesCsv($file) {
		$this->checkFileStatus($file);
		$venues_text = 'venue,shows'."\r\n";
		foreach($this->venueArray as $key=>$val) {
			$venues_text .= $key.','.$val."\r\n";
		}
		file_put_contents($file, $venues_text);
	}

	/**********************************************************************************
		saveEventsCsv()
		____
	*********************************************************************************/
	public function saveEventsCsv($file) {
		$this->checkFileStatus($file);
		$text = "";
		// dump header row first
		$text .= 'raw_date,nice_date,artist,venue,show_url'."\r\n";

		foreach($this->eventArray as $show) {
			$text .= '"'.
			$show['raw_date'].'","'.
			$show["nice_date"].'","'.
					$show['artist'].'","'.
					$show['venue'].'","'.
					$show['url'].'"'.
					"\r\n";
		}
		//$text = html_entity_decode($text);
		file_put_contents($file, $text);
	}

	/**********************************************************************************
		saveToDatabase(event_array)
		insert only new/unique records
	*********************************************************************************/
	public function saveToDatabase() {
		// TODO: insert into db if record isn't already present; could be very taxing
		// return ( true if all good, false if db insert failed );
	}
}// End class Events
?>
