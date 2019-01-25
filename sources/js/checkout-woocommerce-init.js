jQuery(document).ready(function() {
    var cfwInitEvent = new CustomEvent("cfw-initialize", { detail: cfwEventData });
    window.dispatchEvent(cfwInitEvent);

    try {
        window.Parsley.setLocale( cfwEventData.settings.locale );
    } catch( error ) {
        console.log('Failed to set parsley locale.');
    }
});