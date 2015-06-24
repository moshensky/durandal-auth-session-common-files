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

            if (opns.showToast) {
                toastr[opns.type](opns.message, opns.title);
            }
        }

        function sanitize(options, messageType) {
            if (typeof options === 'string' || options instanceof String) {
                return {
                    message: options,
                    type: messageType
                };
            }

            options.type = messageType;
            return options;
        }

        init();

        return {
            log: log,
            warn: function (options) {
                log(sanitize(options, 'warning'));
            },
            info: function (options) {
                log(sanitize(options, 'info'));
            },
            error: function (options) {
                log(sanitize(options, 'error'));
            },
            success: function (options) {
                log(sanitize(options, 'success'));
            }
        };
    });