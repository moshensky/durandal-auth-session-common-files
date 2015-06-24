/*globals define */
define(['knockout', 'common/http', 'jquery', 'autocomplete'],
    function (ko, http, $) {
        'use strict';

        // https://github.com/devbridge/jQuery-Autocomplete
        // input.form-control(id="egn" type="text" data-bind="autocomplete: selectedEgn, serviceUrl: egnServiceUrl, value: egn, enable: inEditMode")

        ko.bindingHandlers.autocomplete = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var value = valueAccessor();
                var serviceUrl = allBindingsAccessor().serviceUrl;
                var inputValue = allBindingsAccessor().value;
                var $element = $(element);

                $element.autocomplete({
                    lookup: function (query, done) {
                        var req = http.get(serviceUrl, { query: query });
                        req.done(done);
                    },
                    onSelect: function (suggestion) {
                        if (ko.isObservable(value) === true) {
                            value(suggestion);
                            inputValue(suggestion.value);
                        }
                    },
                    deferRequestBy: 300,
                    minChars: 3
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.autocomplete('dispose');
                });
            }
        };
    });