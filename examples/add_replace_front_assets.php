<?php

use Objectiv\Plugins\Checkout\Assets\FrontAssets;

/**
 * Class TestAssets
 *
 * Example Assets class. Purpose here is to demonstrate adding more assets to the asset chain
 */
class TestAssets extends FrontAssets {
	public function __construct( $id, array $asset_files = array() ) {
		parent::__construct( $id, $asset_files );
	}
}

/**
 * Example of how to tell the front assets to replace all default assets. Somehow
 */
add_filter('cfw_front_assets_replace', function(){ return false; });

/**
 * Add / replace assets on the asset chain
 */
add_filter('cfw_front_assets_additional', function(){

	$front_assets = array(
		new TestAssets("test_assets", array(
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