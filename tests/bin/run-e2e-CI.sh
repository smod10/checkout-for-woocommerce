#!/usr/bin/env bash
if [[ ${RUN_E2E} == 1 ]]; then

	WP_SITE_URL="http://localhost:8080"
	WP_CORE_DIR="$HOME/wordpress"

	# Go to CFW root plugin dir
	cd "$WP_CORE_DIR/wp-content/plugins/checkout-for-woocommerce"
	CYPRESS_SPEC_DIR=cypress/integration
	CYPRESS_RUNNER=tests/e2e-tests/cypress-runner.js

	# Start xvfb to run the tests
	#export BASE_URL="$WP_SITE_URL"
	#export DISPLAY=:99.0
	#sh -e /etc/init.d/xvfb start
 	#sleep 3

	# Run the tests
    node "$CYPRESS_RUNNER"
fi
