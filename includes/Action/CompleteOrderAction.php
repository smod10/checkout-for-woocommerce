<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class CompleteOrderAction extends Action {

	/**
	 * LogInAction constructor.
	 *
	 * @param $id
	 */
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	/**
	 *
	 */
	public function action() {
		check_ajax_referer("some-seed-word", "security");

		$out = array("response" => "Works");

		$this->out($out);
	}
}