/*global define */
define(['jquery', 'i18n'],
    function ($, i18n) {
    'use strict';

    var loadingMask,
        dimScreen,
        dialog,
        loadingTitle,
        title;

    var createLoadingMask = (function () {
        title = i18n.t('app:loading');
        dimScreen = '<div id="loadingMask" class="spinner"><div class="loadingTitle">' + title +'</div><div class="loader"></div></div>';
        $('body').append(dimScreen);
         loadingMask = $('#loadingMask');
         loadingTitle = $('.loadingTitle').css({
            color: '#ffffff',
            opacity: 1,
            fontSize: '2.5em',
            fontFamily: 'Roboto'
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