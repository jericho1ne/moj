<?php
	function geocodeFullAddress($address) {
		// TODO:  write missingKeys($array) function
		if (isset($address['addy']) && isset($address['city']) && isset($address['zipc']) ) {
			$base = "http://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?";
			$version = "version=4.01&";
			// $format = "format=xml&";
			$format = "format=csv&";


			$location = "streetAddress=" . $address['addy'] .
				"&city=" . $address['city'] .
				"&zip=" . $address['zipc'] .
				"&state=CA";
			$location = str_replace(" ", "+", $location);
			$fullURL = $base . "apiKey=".TEXASAM_APIKEY."&" . $version . $format . $location;

			// echo $fullURL;

			// TODO:  another preliminary check on formatted url

			$returnString = file_get_contents($fullURL);
			$data = explode(",", $returnString);

			// Initialize
			$lat = $lon = 0;

			// Status 200 = Success
			if ($data[2] == 200) {
				// save lat / lon

				$lat = $data[3];
				$lon = $data[4];
			}
			echo $lat . "|" . $lon . "<hr>";


			$payload = array(
				"lat" => $lat,
				"lon" => $lon
			);

			return
				array(
					"success" => true,
					"msg" => "Things seemed to have worked",
					"payload" => $payload
				);
		}
		else {
			// TODO: throw error in php log?
			return
				array(
					"success" => false,
					"msg" => "Problems w/ geocoding Houston..."
				);
		}
	}// End method geocodeFullAddress
?>
