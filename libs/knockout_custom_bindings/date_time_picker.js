/*globals define */
define(['knockout', 'moment', 'jquery', 'libs/timespan', 'bootstrap-datetimepicker'],
    function (ko, moment, $, Timespan) {
        'use strict';

        var datePickerType = {
            commonDateOnly: 1,
            commonTimeOnly: 2,
            commonDateTime: 3,
            customOptions: 4
        };

        // http://eonasdan.github.io/bootstrap-datetimepicker/
        var dateTimePickerSetup = function (dpt) {
            return {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext, datePickerOptions) {
                    var observable = valueAccessor();
                    var $element = $(element);

                    var options = allBindings().datePickerOptions || {};
                    var defaultOpts;

                    var datePicker;
                    var glypiconType;
                    switch (dpt) {
                        case datePickerType.commonDateOnly:
                            defaultOpts = {
                                collapse: false,
                                useCurrent: false,
                                calendarWeeks: true,
                                format: 'L'
                            };

                            glypiconType = 'glyphicon-calendar';
                            break;
                        case datePickerType.commonTimeOnly:
                            defaultOpts = {
                                format: 'LT'
                            };

                            glypiconType = 'glyphicon-time';
                            break;
                        case datePickerType.commonDateTime:
                            defaultOpts = {
                                collapse: false,
                                useCurrent: false,
                                calendarWeeks: true,
                                sideBySide: true
                            };

                            glypiconType = 'glyphicon-calendar';
                            break;
                        default:
                            throw new Error('No such date picker type!');
                    }

                    $element.addClass('input-group date');
                    $element.html(''
                               + '<input type="text" class="form-control" />'
                               + '<span class="input-group-addon">'
                                     + '<span class="glyphicon ' + glypiconType + '"></span>'
                               + '</span>');

                    options = $.extend(defaultOpts, options);
                    datePicker = $element.datetimepicker(options);

                    var value = ko.unwrap(observable);
                    if (dpt === datePickerType.commonTimeOnly) {
                        if (value === undefined || value === null || value === '') {
                            observable(null);
                        } else if (value._isATimespanObject !== true) {
                            observable(new Timespan());
                        }
                    } else {
                        if (value === undefined || value === null || value === '') {
                            observable(null);
                        } else if (typeof value === 'string') {
                            var date = moment(value);
                            observable(date);
                        } else if (moment.isMoment(value)) {
                            //TODO: do nothing, because we already have momentjs date
                        } else {
                            throw new Error('Argument exception. Not a moment.js or string value.');
                        }
                    }

                    datePicker.on('dp.change', function (ev) {
                        if (dpt === datePickerType.commonTimeOnly) {
                            var date = $element.data('DateTimePicker').date();
                            if (date === null) {
                                observable(null);
                            } else {
                                var newTimespan = new Timespan(date);
                                observable(newTimespan);
                            }
                        } else {
                            observable(ev.date);
                        }
                    });

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $element.data('DateTimePicker').destroy();
                    });
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    var $element = $(element);
                    if (value === null) {
                        $element.val('');
                    } else {
                        if (dpt === datePickerType.commonTimeOnly) {
                            value = value.toMoment();
                        } else if (typeof value === 'string') {
                            value = moment(value);
                        } else if (moment.isMoment(value)) {
                            //TODO: do nothing, because we already have momentjs date
                        } else {
                            throw new Error('Argument exception. Not a moment.js or string value.');
                        }

                        $element.data('DateTimePicker').date(value);
                    }
                }
            };
        };

        ko.bindingHandlers.datePicker = dateTimePickerSetup(datePickerType.commonDateOnly);
        ko.bindingHandlers.dateTimePicker = dateTimePickerSetup(datePickerType.commonDateTime);
        ko.bindingHandlers.timePicker = dateTimePickerSetup(datePickerType.commonTimeOnly);

        ko.bindingHandlers.datePickerEnable = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext, datePickerOptions) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var $element = $(element);
                if (value) {
                    $element.find('>:first-child').removeAttr('disabled');
                } else {
                    $element.find('>:first-child').attr('disabled', 'disabled');
                }
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var $element = $(element);
                if (value) {
                    $element.find('>:first-child').removeAttr('disabled');
                } else {
                    $element.find('>:first-child').attr('disabled', 'disabled');
                }
            }
        };
    });