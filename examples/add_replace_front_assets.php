<?php

use Objectiv\Plugins\Checkout\Assets\FrontAssets;

/**
 * Example of how to tell the front assets to replace all default assets. Somehow
 */
add_filter('cfw_front_assets_replace', function(){ return false; });

/**
 * Add / replace assets on the asset chain
 */
add_filter('cfw_front_assets_additional', function(){

	$front_assets = array(
		new FrontAssets("test_assets", array(
			"css" => array(
				(object) array(
					"path" => "path/goes/here",
					"attrs" => array()
				)
			),
			"js" => array(
				(object) array(
					"path" => "path/goes/here",
					"attrs" => array()
				)
			)
		))
	);

	return $front_assets;
});