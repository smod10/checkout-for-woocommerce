<?php

/**
 * Program Flags
 *
 * Title - Flag - Default Value
 *
 * Dev Mode - CO_DEV_MODE - false
 */
$env = new Dotenv\Dotenv(__DIR__);
$env->load();

// Dev Mode
define( 'CO_DEV_MODE', boolval(getenv('CFW_DEV_MODE')) );