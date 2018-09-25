<?php

/**
 * Program Flags
 *
 * Title - Flag - Default Value
 *
 * Dev Mode - CFW_DEV_MODE - false
 */
$env = new Dotenv\Dotenv(__DIR__);
$env->load();

// Dev Mode
define( 'CFW_DEV_MODE', getenv('CFW_DEV_MODE') == "true" ? true : false );