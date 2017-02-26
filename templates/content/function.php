<?php

return array(
	"parameters" => ["Param 1 - Content", "Param 2 - Content"],
	"callback" => function($param1, $param2){
		$output = array("Output: $param1, $param2");
		return $output;
	}
);