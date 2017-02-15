<?php
/**
 * Created by PhpStorm.
 * User: brandon
 * Date: 2/15/17
 * Time: 3:41 AM
 */

namespace Objectiv\Plugins\Checkout;


/**
 * Class Template
 *
 * @package Objectiv\Plugins\Checkout
 */
class Template {

    /**
     * @var
     */
    protected $path;

    /**
     * @var
     */
    protected $callback;

    /**
     * @var
     */
    protected $parameters;

    /**
     * Template constructor.
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