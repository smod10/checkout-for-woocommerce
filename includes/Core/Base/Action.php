<?php

namespace Objectiv\Plugins\Checkout\Core\Base;

use Objectiv\Plugins\Checkout\Core\Loader;

/**
 * Class Action
 * @package Objectiv\Plugins\Checkout\Core\Base
 */
abstract class Action extends Tracked {

	/**
	 * Action constructor.
	 *
	 * @param $id
	 */
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

	/**
	 * @param $out
	 */
	protected function out($out) {
		echo json_encode($out, JSON_FORCE_OBJECT);
		wp_die();
	}

	/**
	 * @return mixed
	 */
	abstract public function action();
}