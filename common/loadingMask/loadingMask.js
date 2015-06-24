/*global define */
define(['jquery', 'i18n'],
    function ($, i18next) {
    'use strict';

    var loadingMask,
        dimScreen,
        dialog;

    var createLoadingMask = (function () {
        var title = i18next.t('app:loading');
        dimScreen = '<div id="loadingMask" class="panel panel-default"><div class="panel-body"><i class="fa fa-spinner fa-spin fa-2x"></i><span data-i18n="app:loading" style="position: relative; top: -6px;">' + title + '</span></div></div>';
        $('body').append(dimScreen);
        loadingMask = $('#loadingMask').css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: '0.5',
            backgroundColor: '#000',
            display: 'none',
            top: 0,
            zIndex: 2000,
            textAlign: 'center',
            paddingTop: '20%',
            fontSize: '25px'
        });

        dialog = $('#loadingMask div').css({
            display: 'inline-block',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '7px',
            boxShadow: 'rgba(0, 0, 0, 0.498039) 0px 5px 15px 0px'
        });
    }());

    return {
        show: function () {
            loadingMask.show();
        },
        hide: function () {
            loadingMask.hide();
        }
    };
});
