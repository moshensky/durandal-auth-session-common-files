/*globals define */
define(['knockout', 'services/session','i18n', 'knockout-validation'],
    function (ko, session, i18n) {
        'use strict';

        var configureKnockout = function () {
            ko.validation.init({
                insertMessages: false,
                decorateInputElement: true,
                errorElementClass: 'has-error',
                errorMessageClass: 'help-block'
            });


            ko.validation.rules.isValidEGN = {
                validator: function (egn) {
                    
                    var valid = true;
                    if (egn !== undefined && egn !== null) {
                        if (egn.length !== 10) {
                            valid = false;
                        } else {
                            var arrayEGN = egn.split('');
                            var arrayWeight = [2, 4, 8, 5, 10, 9, 7, 3, 6];

                            var total = 0;

                            for (var i = 0; i < 9; i += 1) {
                                total += arrayEGN[i] * arrayWeight[i];
                            }

                            valid = (total % 11 < 10 ? total % 11 : 0) === arrayEGN[9];
                        }
                    }
                    return valid;
                }
                
            };

            ko.validation.rules.isValidPNF = {
                validator: function (pnf) {
                    var valid = true;
                    if (pnf !== undefined && pnf !== null) {
                        if (pnf.length !== 10) {
                            valid = false;
                        } else {
                            var arrayPNF = pnf.split('');
                            var arrayWeight = [21, 19, 17, 13, 11, 9, 7, 3, 1];

                            var total = 0;

                            for (var i = 0; i < 9; i += 1) {
                                total += arrayPNF[i] * arrayWeight[i];
                            }

                            valid = (total % 10) === arrayPNF[9];
                        }
                    }
                    return valid;

                }
            };

            ko.validation.registerExtenders();

            if (!ko.utils.cloneNodes) {
                ko.utils.cloneNodes = function (nodesArray, shouldCleanNodes) {
                    for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i+=1) {
                        var clonedNode = nodesArray[i].cloneNode(true);
                        newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
                    }
                    return newNodesArray;
                };
            }

            ko.bindingHandlers.ifIsInRole = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    ko.utils.domData.set(element, '__ko_withIfBindingData', {});
                    return {
                        'controlsDescendantBindings': true
                    };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var withIfData = ko.utils.domData.get(element, '__ko_withIfBindingData'),
                        dataValue = ko.utils.unwrapObservable(valueAccessor()),
                        shouldDisplay = session.userIsInRole(dataValue),
                        isFirstRender = !withIfData.savedNodes,
                        needsRefresh = isFirstRender || (shouldDisplay !== withIfData.didDisplayOnLastUpdate),
                        makeContextCallback = false;

                    if (needsRefresh) {
                        if (isFirstRender) {
                            withIfData.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                        }

                        if (shouldDisplay) {
                            if (!isFirstRender) {
                                ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(withIfData.savedNodes));
                            }
                            ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                        } else {
                            ko.virtualElements.emptyNode(element);
                        }

                        withIfData.didDisplayOnLastUpdate = shouldDisplay;
                    }
                }
            };
        };

        return configureKnockout;
    });
