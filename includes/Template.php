<?php
/**
 * Created by PhpStorm.
 * User: brandon
 * Date: 2/15/17
 * Time: 3:41 AM
 */

namespace Objectiv\Plugins\Checkout;


/**
 * The template handles showing the view and running the associated call back to handle custom functionality.
 *
 * @link       brandont.me
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout
 */

/**
 * Longer description for the above goes here.
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */

class Template {

    /**
     * The template path
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $path    The template path
     */
    protected $path;

    /**
     * The template callback
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $callback    The template callback
     */
    protected $callback;

    /**
     * The template parameters
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $parameters    The template parameters
     */
    protected $parameters;

    /**
     * Template constructor.
     *
     * @param $path
     * @param $callback
     * @param $parameters
     */
    public function __construct($path, $callback, $parameters) {
        $this->path = $path;
        $this->callback = $callback;
        $this->parameters = $parameters;
    }

    /**
     * @return mixed
     */
    public function get_path()
    {
        return $this->path;
    }

    /**
     * @return mixed
     */
    public function get_callback()
    {
        return $this->callback;
    }

    /**
     * @return mixed
     */
    public function get_parameters()
    {
        return $this->parameters;
    }

    /**
     * @return mixed
     */
    public function view() {
        $parameters = $this->parameters;
        $path = $this->path;

        $parameters = call_user_func($this->callback, $parameters);

        require_once $path;
    }
}