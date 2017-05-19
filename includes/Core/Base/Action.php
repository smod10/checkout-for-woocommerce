<?php

namespace Objectiv\Plugins\Checkout\Core\Base;

use Objectiv\Plugins\Checkout\Core\Loader;

abstract class Action extends Tracked {

	public function __construct( $id ) {
		parent::__construct( $id );
	}

	/**
	 * @param Loader $loader
	 * @param boolean $np
	 */
	public function load($loader, $np = true) {
		$loader->add_action("wp_ajax_{$this->get_id()}", array($this, 'action'));

		if($np) {
			$loader->add_action( "wp_ajax_nopriv_{$this->get_id()}", array( $this, 'action' ) );
		}
	}

	protected function out($out) {
		echo json_encode($out, JSON_FORCE_OBJECT);
		wp_die();
	}

	abstract public function action();
}