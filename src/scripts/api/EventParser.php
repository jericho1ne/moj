<?php

/**
 * Class EventParser
 * 
 */
class EventParser {

	//
	// PROPERTIES
	//
	private $dbLink;			// Gotta have legit db connection first!
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
	public function __construct($database_link) {
		// Save db link
		$this->dbLink = $database_link;

		// Get today's date w/ leading zeros for month and day
		// TODO:  leave today and trrow as Y-m-d and custom format inside each scraper
		$this->today_formatted = date('m.d.y');
		
		// Get tomorrow's date w/ leading zeros for month and day
		$today = date('Y-m-d');
		$this->trrow_formatted = date('m.d.y', strtotime($today . "+1 days"));

		// TODO:  abstract final formatting logic, break up into different parsers
		//	eg: Flavorpill, LA Weekly, Enclave LA, Songkick, etc
		// 			// build up array of live music events, save to events array
		// return $this->eventArray;
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
		parseScenestarUrl( $url )
		fill in the eventArray & venueArray
	*********************************************************************************/
	public function parseScenestarUrl($url) {
		// Search for shows beginning with today's date
		$searchDate = $this->today_formatted;

		// Ingest webpage source
		$scenestarHTML = file_get_contents($url);							

		// If time is nearing midnight, we may get no results
		// Therefore, grab next day's shows (d+1)
		if (strpos($scenestarHTML, $this->today_formatted) === -1) {
			$searchDate = $this->trrow_formatted;
		}
		
		// Look for our start date, mark as entry point
		$start = strpos($scenestarHTML, $searchDate);	
		// find the end marker (this *may* change every so often)	
		$end = strpos($scenestarHTML, '<div id="gamma">');	
		// find character length up to the end marker
		$data_size = $end - $start;		
		// grab only the repeated, relevant show data							
		$rough_chunk = substr($scenestarHTML, $start-1, $data_size);	

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
				$ymd_date = "20" . $dateArray[2] . "-" . $dateArray[0] . "-" . $dateArray[1];
				// stop if over our set date boundary (1 or 2 weeks ahead, etc)
				if ($future_max_date < $ymd_date) {
					break;
				}

				$month = date("F", strtotime($ymd_date));

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
				$venues[$count] = $venue;

				// ********** DEBUG ******
				// Uncomment line below to see what the f is wrong
				// echo $ymd_date . " " . $artist . " @ " . $venue ."<br>";

				// Save all of our event info to the private class property (eventArray)
				array_push(
					$this->eventArray, 		
					array(
						"ymd_date"	=> $ymd_date,	// 2020-12-01
						"source" 	=> "scenestar",
						"type"		=> "show",  		// TODO: find out if needed for Event Calendar??
						"artist"	=> $artist,
						"venue"		=> $venue,
						"title"		=> $artist . " @ " . $venue,	// needed for Event Calendar!
						"description" => "",
						"url"		=> $url,
						"media"		=> "",
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
	}// End method parseScenestarUrl

	public function parseExpLAxml($url) {
		// Grab in XML format		
		$simpleXML = simplexml_load_file($url);
		
		// print_r($simpleXML);
		/*
		[title] => Father, Son & Holy Coach
		    [link] => http://www.experiencela.com/calendar/event/68113
		    [description] => Southern storytelling at its best! [...]
		    [guid] => http://www.experiencela.com/calendar/event/68113
		    [datetime] => March 4, 2016; 8:00 PM - 9:15 PM
		    [startDate] => Fri, 04 Mar 2016 20:00:00 GMT -08:00
		    [endDate] => Fri, 04 Mar 2016 21:15:00 GMT -08:00
		    [image] => http://ww1.experiencela.com/Uploads/20070904124551-63848.jpg
		    [organizationEntryId] => 3480
		    [organization] => Lucy Pollak Public Relations
		    [region] => Beverly Hills / Westside
		    [eventWebsite] => http://www.holycoach.net/.
		    [location] => Odyssey Theatre
		    [eventAddress] => 2055 S. Sepulveda Blvd., Los Angeles, 90025
		    [eventLocationStreetIntersection1] => S. Sepulveda Blvd.
		    [eventLocationStreetIntersection2] => Mississippi Ave.
		    [toolsMetroTripPlanner] => http://www.experiencela.com/MetroTripPlanner?value1=2055 S. Sepulveda Blvd., Los Angeles, 90025
		    [category] => Array
		        (
		            [0] => Visual Arts
		            [1] => Live Theater
		            [2] => Educational
		            [3] => Museums/Zoos/Aquariums
		        )

		    [eventLocationHearing] => False
		    [eventLocationWheelChair] => True
		    [eventKidFamily] => False
		    [eventFree] => False
		    [eventCostExplain] => $15 - $25
		*/
	
		

		foreach($simpleXML->channel->item as $Item) {		
			// Categories is an array
			$categoryArray = (array) $Item->category;
			$categories = implode(', ', $categoryArray);

			// Format Date as Y-m-d
			$rssDate = (string) $Item->startDate;
			$ymd_date = date('Y-m-d', strtotime($rssDate));
		
			$event = array(
				'ymd_date' 		=> $ymd_date,
				'source'		=> 'Experience LA',
				'startDate' 	=> (string) $Item->startDate,
				'url' 			=> (string) $Item->link,
				'title' 		=> (string) $Item->title,
				'organization' 	=> (string) $Item->organization,
				'media'			=> (string) $Item->image,
				'description' 	=> (string) $Item->description,
				'venue' 		=> (string) $Item->location,
				'address' 		=> (string) $Item->eventAddress,
				'category' 		=> $categories,
			);

			// Minor formatting if these next fields are all CAPS (eek!)
			if (strtoupper($event['title']) == $event['title']) {
				$event['title'] = ucwords(strtolower($event['title']));
			}
			if (strtoupper($event['description']) == $event['description']) {
				$event['description'] = ucwords(strtolower($event['description']));
			}

			// Save all of our event info to the private class property (eventArray)
			array_push(
				$this->eventArray, 		
				array(
					"ymd_date"	=> $ymd_date,	// 2020-12-01
					"type"		=> $event['category'],
					"source"	=> "experiencela",
					"artist"	=> $event['organization'],
					"venue"		=> $event['venue'],
					"title"		=> $event['title'],
					"description" => $event['description'],
					"url"		=> $event['url'],
					"media"		=> $event['media'],
				)
			);// End array_push

		}// End foreach simpleXML
	}// End parseExLAxml

	/**********************************************************************************
		saveJsonToFile( filename )
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
		return event array
	*********************************************************************************/
	public function getEvents() {
		// echo "<pre>"; print_r($this->eventArray); echo "</pre>";
		return $this->eventArray;
	}

	/**********************************************************************************
		getEventsFromDb()
		return events from database
	*********************************************************************************/
	public function getEventsFromDb($format = '', $cutoffDate = '') {
		if ($this->dbLink) {

			$query = "SELECT *, DATE_FORMAT(ymd_date,'%W %M %D') AS nice_date, " . 
				"DATE_FORMAT(ymd_date,'%a %b %e') AS short_date " . 
				"FROM events ";

			if ($cutoffDate != '') {
				$query .= ' WHERE ymd_date >= :ymd_date';
			}

			// For now, add a secondary order by on last modified date 
			$query .= ' ORDER BY ymd_date ASC, updated DESC';

			// Prepare SELECT query
			$statement = $this->dbLink->prepare($query);

			if ($cutoffDate != '') {
				$statement->execute(array(':ymd_date' => $cutoffDate));
			}
			else {
				$statement->execute();
			}

			$dataRows = $statement->fetchAll(PDO::FETCH_ASSOC);

			//		DEBUG
			// $statement->debugDumpParams();

			if ($format === 'json') {
				return json_encode($dataRows);
			}
			else {
				return $dataRows;
			}
		}// End if db link is set
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
		$text .= 'nice_date,artist,venue,show_url'."\r\n";

		foreach($this->eventArray as $show) {
			$text .= '"'.
			$show["nice_date"].'","'.
			$show['artist'].'","'.
			$show['venue'].'","'.
			$show['url'].'"'.
			"\r\n";
		}
		//$text = html_entity_decode($text);
		file_put_contents($file, $text);
	}

	/**
	 * saveEventsToDb()
	 */
	public function saveEventsToDb($dbLink) {
		foreach ($this->eventArray as $key => $eachEvent) {
			$this->saveSingleEventToDb($dbLink, $eachEvent);
		}
	}

	/**********************************************************************************
		saveToDatabase(event_array)
		insert only new/unique records
	*********************************************************************************/
	public function saveSingleEventToDb($dbLink, $event) {
		// TODO: insert into db if record isn't already present; could be very taxing
		// return ( true if all good, false if db insert failed );

		pr($event);

		// Prepare insert query
		$statement = $dbLink->prepare(
			"INSERT INTO events(ymd_date, source, type, artist, venue, title, description, url, media) ".
   			"VALUES(:ymd_date, :source, :type, :artist, :venue, :title, :description, :url, :media) ".
   			"ON DUPLICATE KEY UPDATE title = :title2, url = :url2");

		$eventObject = array(
			"ymd_date" => $event['ymd_date'],
			"source" 	=> $event['source'],
			"type" 		=> $event['type'],
			"artist" 	=> $event['artist'],
			"venue" 	=> $event['venue'],
			"description" => $event['description'],
			"media" 	=> $event['media'],
			"title" 	=> $event['title'],
			"title2" 	=> $event['title'],
			"url" 		=> $event['url'],
			"url2" 		=> $event['url']
		);

		// Map statement column names to event that was passed in
		$result = $statement->execute($eventObject);

		echo "<pre>"; $statement->debugDumpParams(); echo "</pre>";

		return array(
			"result" => $result, 
			"errorCode" => $statement->errorCode()
		);

	}
}// End class Events
?>
