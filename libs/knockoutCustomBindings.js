/*globals define */
define(['knockout', 'jquery'],
    function (ko, $) {
        'use strict';

        var windowURL = window.URL || window.webkitURL;
        ko.bindingHandlers.file = {
            init: function (element, valueAccessor) {
                $(element).change(function () {
                    var file = this.files[0];
                    if (ko.isObservable(valueAccessor())) {
                        valueAccessor()(file);
                    }
                });
            },

            update: function (element, valueAccessor, allBindingsAccessor) {
                var file = ko.utils.unwrapObservable(valueAccessor());
                var bindings = allBindingsAccessor();

                if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
                    var oldUrl = bindings.fileObjectURL();
                    if (oldUrl) {
                        windowURL.revokeObjectURL(oldUrl);
                    }
                    bindings.fileObjectURL(file && windowURL.createObjectURL(file));
                }

                if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
                    if (!file) {
                        bindings.fileBinaryData(null);
                    } else {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            bindings.fileBinaryData(e.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                    }
                }
            }
        };

        //http://wilsonhut.wordpress.com/2012/01/07/knockout-jqueryui-draggabledroppable/
        ko.bindingHandlers.drag = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var dragElement = $(element);
                var dragOptions = {
                    helper: 'clone',
                    revert: true,
                    revertDuration: 0,
                    zIndex: 999,
                    //start: function() {
                    //_dragged = ko.utils.unwrapObservable(valueAccessor().value);
                    //},
                    cursor: 'default'
                };
                dragElement.draggable(dragOptions).disableSelection();
                var calendarEventData = ko.utils.unwrapObservable(valueAccessor().value);
                dragElement.data('eventObject', calendarEventData);
            }
        };

        ko.bindingHandlers.dialog = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = ko.utils.unwrapObservable(valueAccessor()) || {};
                var $element = $(element);

                $element.dialog(options);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.dialog('destroy');
                });

                return { controlsDescendantBindings: false };
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var $element = $(element);
                var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);

                $element.dialog(shouldBeOpen ? 'open' : 'close');
            }
        };
    });