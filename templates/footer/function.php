<?php

return array(
	"parameters" => ["Param 1 - Footer", "Param 2 - Footer"],
	"callback" => function($param1, $param2){
		$output = array("Output: $param1, $param2");
		return $output;
	}
);