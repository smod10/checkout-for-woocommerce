<?php

/**
 * Program Flags
 *
 * Title - Flag - Default Value
 *
 * Dev Mode - CFW_DEV_MODE - false
 */
$env = new Dotenv\Dotenv( __DIR__ );
if ( file_exists( __DIR__ . '/.env' ) ) {
	$env->load();
}

if ( ! defined( 'CFW_DEV_MODE' ) ) {
	// Dev Mode
	define( 'CFW_DEV_MODE', getenv( 'CFW_DEV_MODE' ) == 'true' ? true : false );
}
