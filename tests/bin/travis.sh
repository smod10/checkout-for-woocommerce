#!/usr/bin/env bash
# usage: travis.sh before|after

if [ $1 == 'before' ]; then

	composer global require "phpunit/phpunit=5.*"

	if [[ ${RUN_PHPCS} == 1 ]]; then
		composer install
	fi

fi

if [ $1 == 'after' ]; then

    WP_CORE_DIR="$HOME/wordpress"
    CFW_DIR="$WP_CORE_DIR/wp-content/plugins/checkout-for-woocommerce"

	if [[ ${RUN_CODE_COVERAGE} == 1 ]]; then
		bash <(curl -s https://codecov.io/bash)
		wget https://scrutinizer-ci.com/ocular.phar
		chmod +x ocular.phar
		php ocular.phar code-coverage:upload --format=php-clover coverage.clover
	fi

	if [[ ${RUN_E2E} == 1 && $(ls -A $CFW_DIR/cypress/screenshots) ]]; then
		if [[ -z "${ARTIFACTS_KEY}" ]]; then
  			echo "Screenshots were not uploaded. Please run the e2e tests locally to see failures."
		else
  			curl -sL https://raw.githubusercontent.com/travis-ci/artifacts/master/install | bash
			artifacts upload
		fi
	fi

fi
