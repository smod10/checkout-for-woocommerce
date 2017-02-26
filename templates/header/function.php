<?php

return array(
	"parameters" => ["Param 1 - Header", "Param 2 - Header"],
	"callback" => function($param1, $param2){
		$output = array("Output: $param1, $param2");
		return $output;
	}
);