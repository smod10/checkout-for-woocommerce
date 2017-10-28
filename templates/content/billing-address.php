<div id="cfw-shipping-same-billing" class="cfw-module">
	<ul class="cfw-radio-reveal-group">
		<li class="cfw-radio-reveal-li cfw-no-reveal">
			<div class="cfw-radio-reveal-title-wrap">
				<label class="cfw-radio-reveal-title-wrap cfw-radio-reveal-label">
					<input type="radio" name="shipping_same" id="shipping_same_as_billing" value="0" class="garlic-auto-save" checked />
					<span class="cfw-radio-reveal-title"><?php esc_html_e( 'Same as shipping address', 'checkout-wc' ); ?></span>
				</label>
			</div>
		</li>
		<li class="cfw-radio-reveal-li">
			<div class="cfw-radio-reveal-title-wrap">
				<label class="cfw-radio-reveal-label">
					<input type="radio" name="shipping_same" id="shipping_dif_from_billing" value="1" class="garlic-auto-save" />
					<span class="cfw-radio-reveal-title"><?php esc_html_e( 'Use a different billing address', 'checkout-wc' ); ?></span>
				</label>
			</div>
			<div class="cfw-radio-reveal-content-wrap" style="display: none">
				<div id="cfw-billing-fields-container" class="cfw-radio-reveal-content">
					<?php cfw_get_billing_checkout_fields($checkout); ?>
				</div>
			</div>
		</li>
	</ul>
</div>