<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class KlarnaPayment extends Base {

	protected $klarna_payments = null;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		$is_available = false;

		$available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
		$this->klarna_payments = $available_gateways['klarna_payments'];

		if(class_exists( '\\WC_Klarna_Payments' ) && $this->klarna_payments){
			$is_available = true;
		}

		return $is_available;
	}

	function typescript_class_and_params( $compatibility ) {
		$compatibility[] = [
			'class'  => 'KlarnaPayment',
			'event' => 'before-setup',
			'params' => [],
		];

		return $compatibility;
	}

	function run() {
		add_action('cfw_payment_gateway_list_klarna_payments_alternate', array($this, 'klarna_payments_content'));
		add_filter("cfw_show_gateway_klarna_payments", "__return_false");
	}

	function klarna_payments_content() {
		$klarna_dom = new \DOMDocument();
		$klarna_dom->loadHTML($this->get_klarna_template());
		$li_elements = $klarna_dom->getElementsByTagName("li");

		for($i = 0; $i < $li_elements->count(); $i++) {
			$this->manipulate_li_container($klarna_dom, $li_elements->item($i));
		}

		echo $klarna_dom->saveHTML();
	}

	/**
	 * @param \DOMDocument $dom
	 * @param \DOMElement $li
	 */
	function manipulate_li_container($dom, $li) {

		// Regex patterns
		$klarna_data_pattern = "/(klarna_payments)_{1}[a-z_-]*/";
		$klarna_payment_method_pattern = '/(payment_method_klarna_payments)_{1}[a-z_-]*/';
		$klarna_payment_box_pattern = '/payment_box/';

		// Get item references
		$inputs = $li->getElementsByTagName("input");
		$payment_method_icons = $dom->getElementsByTagName("img");
		$divs = $dom->getElementsByTagName("div");
		$labels = $dom->getElementsByTagName("label");

		// Add the reveal class
		$li->setAttribute("class", $li->getAttribute("class") . " cfw-radio-reveal-li");

		// Create the wrapper divs
		$title_bar = $dom->createElement("div");
		$title_bar->setAttribute("class", "payment_method_title_wrap cfw-radio-reveal-title-wrap");

		$content = $dom->createElement("div");
		$content->setAttribute("class", "payment_box_wrap cfw-radio-reveal-content-wrap");

		// Create title bar containers
		$label_text = $dom->createElement("span");
		$label_text->setAttribute("class", "payment_method_title cfw-radio-reveal-title");

		$payment_method_icon_container = $dom->createElement("span");
		$payment_method_icon_container->setAttribute("class", "payment_method_icons");

		$title_label = $dom->createElement("label");
		$title_label->setAttribute("class", "payment_method_label cfw-radio-reveal-label");

		$payment_selector = $this->get_element($inputs, $klarna_payment_method_pattern, "id");

		$klarna_payment_label = $this->get_element($labels, $klarna_payment_method_pattern, "for");
		$payment_box = $this->get_element($divs, $klarna_payment_box_pattern, "class");
		$payment_box->setAttribute("class", $payment_box->getAttribute("class") . " cfw-radio-reveal-content");

		for($i = 0; $i < $klarna_payment_label->childNodes->count(); $i++) {
			$label_child_node = $klarna_payment_label->childNodes->item($i);

			if($label_child_node->nodeName == "a") {
				$label_child_node->removeAttribute( "style" );
			}

			$label_text->appendChild($label_child_node);
		}

		// Append the title label items
		$title_label->appendChild($label_text);

		// Append the payment icons
		for($i = 0; $i < $payment_method_icons->count(); $i++) {
			$payment_method_icon_container->appendChild($payment_method_icons->item($i));
		}

		// Append the title label and payment method icon container
		$title_bar->appendChild($title_label);
		$title_bar->appendChild($payment_method_icon_container);

		$content->appendChild($payment_box);

		// Append payment method title bar and content
		$li->appendChild($payment_selector);
		$li->appendChild($title_bar);
		$li->appendChild($content);

		$klarna_payment_label->parentNode->removeChild($klarna_payment_label);

	}

	/**
	 * @param \DOMNodeList $elements
	 * @param string $pattern
	 * @param string $attribute
	 * @param boolean $recursive
	 *
	 * @return \DOMElement
	 */
	function get_element($elements, $pattern, $attribute, $recursive = false) {
		for($i = 0; $i < $elements->count(); $i++) {
			$element = $elements->item($i);

			// Skip text nodes
			if($element->nodeType != XML_ELEMENT_NODE || !$element->hasAttribute($attribute))
				continue;

			d("Node Name: {$element->nodeName}| Data Attribute: $attribute | Has Attribute: {$element->hasAttribute($attribute)} | Has Children: {$element->hasChildNodes()}");

			if(preg_match($pattern, $element->getAttribute($attribute))) {
				return ($recursive && $element->hasChildNodes()) ? $this->get_element($element->childNodes, $pattern, $attribute, true) : $element;
			}
		}
	}

	function get_klarna_template() {
		ob_start();
		echo wc_get_template('checkout/payment-method.php', ["gateway" => $this->klarna_payments]);
		$klarna_template = ob_get_contents();
		ob_clean();

		return $klarna_template;
	}
}
