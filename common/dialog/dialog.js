define(['plugins/dialog', 'knockout', 'i18n', 'jquery'],
    function (Dialog, ko, i18n, $) {
        'use strict';

        //prevents user interaction with keyboard
        $(window).keydown(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        });

        var CustomDialog = function (opts) {
            this.title = opts.title;
            this.msg = opts.msg;
            this.model = opts.model || {};

            this.okBtnText = opts.okBtnText || i18n.t('app:common.ok');
            this.okBtnClasses = ko.observable(opts.okBtnClasses || 'btn btn-default');

            this.showCancelBtn = opts.showCancelBtn || false;
            this.cancelBtnText = opts.cancelBtnText || i18n.t('app:common.cancel');
            this.cancelBtnClasses = opts.cancelBtnClasses || 'btn btn-default';

            this.showThirdBtn = opts.showThirdBtn || false;
            this.thirdBtnText = opts.thirdBtnText || 'Third Button';
            this.thirdBtnClasses = opts.thirdBtnClasses || 'btn btn-default';
            this.thirdBtnReturnStatus = opts.thirdBtnReturnStatus || undefined;

            this.customWidth = opts.customWidth;               
        };

        CustomDialog.prototype = {
            show: function () {
                return Dialog.show(this);
            },
            ok: function () {
                var status = true;
                this._executeAction(status);
            },
            cancel: function () {
                var status = false;
                this._executeAction(status);
            },
            third: function () {
                var status = this.thirdBtnReturnStatus;
                this._executeAction(status);
            },
            _executeAction: function (status) {
                var executeAction = true;
                var executeActionPromise;

                if (typeof this.model.onDialogButtonClick === 'function') {
                    executeAction = this.model.onDialogButtonClick(status);

                    if (executeAction) {
                        Dialog.close(this, this.model, status);
                    }
                } else if (typeof this.model.onDialogButtonClickSync === 'function') {
                    var self = this;

                    executeActionPromise = this.model.onDialogButtonClickSync(status);

                    if (executeActionPromise !== undefined) {
                        executeActionPromise.then(function (allowDialogClose) {
                            if (allowDialogClose === true) {
                                Dialog.close(self, self.model, status);
                            }
                        });
                    } else {
                        Dialog.close(this, this.model, status);
                    }
                } else {
                    Dialog.close(this, this.model, status);
                }
            }
        };

        return CustomDialog;
    });
