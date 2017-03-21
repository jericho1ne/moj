<?php

	// Footlong development
	// http://www.footlongdevelopment.com/category/events/feed/
	$xmlData = file_get_contents("http://www.footlongdevelopment.com/category/events/feed/");
	
	
	// If local file, use simplexml_load_file
	$xml = simplexml_load_string($xmlData) or die("Error: Cannot create object");
	
	foreach ($xml as $object) {
		// ATTRIBUTE NAMES ARE CASE-SENSITIVE
	 	//  $loc = $object->attributes()->lokasyon;
	  	// $dep = $object->attributes()->Depth;
		//print_r($object);
		print_r($object->item->title->__toString());
		print_r($object->item->link->__toString());
		print_r($object->item->guid->__toString());
		//$title = 
		
	}
	
?>
