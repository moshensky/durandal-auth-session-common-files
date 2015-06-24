/*globals define */
define(['toastr', 'jquery'],
    function (toastr, $) {
        'use strict';

        // Internal properties and functions
        var defaults = {
            source: 'app',
            title: '',
            message: 'no message provided',
            data: '',
            showToast: true,
            type: 'info'
        };

        function init() {
            toastr.options.closeButton = true;
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.options.backgroundpositionClass = 'toast-bottom-right';
            toastr.options.fadeOut = 1000;
        }

        function log(options) {
            var opns = $.extend({}, defaults, options);

            system.log(opns.source + ', ' + opns.type + ', ' + opns.message + ', ' + opns.data + ' ');

            if (opns.showToast) {
                toastr[opns.type](opns.message, opns.title);
            }
        }

        init();

        return {
            log: log,
            warn: function (options) {
                options.type = 'warning';
                log(options);
            },
            info: function (options) {
                options.type = 'info';
                log(options);
            },
            error: function (options) {
                options.type = 'error';
                log(options);
            },
            success: function (options) {
                options.type = 'success';
                log(options);
            }
        };
    });