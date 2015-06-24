/*globals define */
define(['knockout', 'jquery', 'select2'],
    function (ko, $) {
        'use strict';

        ko.bindingHandlers.select2 = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var obj = valueAccessor(),
                    allBindings = allBindingsAccessor(),
                    lookupKey = allBindings.lookupKey;

                var $element = $(element);
                $element.css('width', '100%');
                $element.select2(obj);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.select2('destroy');
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                var options = allBindingsAccessor().select2Options || {};

                for (var property in options) {
                    if (options.hasOwnProperty(property)) {
                        $(element).select2(property, ko.utils.unwrapObservable(options[property]));
                    }
                }

                $(element).trigger('change');
            }
        };

    });