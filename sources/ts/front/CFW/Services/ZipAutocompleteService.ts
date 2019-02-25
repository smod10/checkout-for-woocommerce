let w: any = window;
declare let jQuery: any;

export class ZipAutocompleteService {
    /**
     * Attach change events to postcode fields
     */
    setZipAutocompleteHandlers() {
        if ( w.cfwEventData.settings.enable_zip_autocomplete != true ) {
            return true;
        }
        
        jQuery( document.body ).on( 'textInput input change keypress paste', '#shipping_postcode, #billing_postcode', this.autoCompleteCityState );
    }

    autoCompleteCityState( e ) {
        let type_prefix = jQuery(this).attr('id').split('_')[0];

        let zip = jQuery(this).val().trim();
        let country = jQuery('#' + type_prefix + '_country').val();

        /**
         * Unfortunately, some countries copyright their zip codes
         * Meaning that you can only look up by the first 3 characters which
         * does not provide enough specificity so we skip them
         *
         * This is an incomplete list. Just hitting some big ones here.
         */
        let country_filter = [ 'GB', 'CA' ];

        if ( country_filter.indexOf( country ) !== -1 ) {
            return;
        }

        ZipAutocompleteService.getZipData(country, zip, type_prefix);
    }

    static getZipData( country, zip, type_prefix ) {
        jQuery.ajax({
            url: 'https://api.zippopotam.us/' + country + '/' + zip,
            cache: true,
            dataType: 'json',
            type: 'GET',
            success: function(result, success) {
                jQuery.each( result.places, function(index, value) {
                    jQuery( '#' + type_prefix + '_city').val( this['place name'] ).trigger( 'change' );
                    jQuery('[name="' + type_prefix + '_state"]:visible').val(this['state abbreviation']).trigger('change');
                } );
            },
            error: function(result, success) {
                //console.log(result);
            }
        });
    }
}