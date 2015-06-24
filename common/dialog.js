define(['./dialog/dialog', 'jquery'],
    function (Dialog, $) {
        'use strict';

        return {
            confirm: function (opts) {
                if (opts.msg === undefined || opts.msg === '') {
                    throw new Error('Argument Exception. Message is not defined.');
                }

                var dialog = new Dialog({
                    title: opts.title || '',
                    msg: opts.msg,
                    showCancelBtn: true,
                    cancelBtnText: opts.cancelBtnText
                });

                var promise = dialog.show();
                var deferred = $.Deferred();

                promise.done(function (_, status) {
                    if (status === true) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise();
            },
            message: function (opts) {
                if (opts.msg === undefined || opts.msg === '') {
                    throw new Error('Argument Exception. Message is not defined.');
                }

                var dialog = new Dialog({
                    title: opts.title || '',
                    msg: opts.msg
                });

                var promise = dialog.show();
                var deferred = $.Deferred();

                promise.done(function (_, status) {
                    if (status === true) {
                        deferred.resolve();
                    } else {
                        throw new Error('Luke! Check your logic flow! This is message!');
                    }
                });

                return deferred.promise();
            },
            warning: function (opts) {
                throw new Error('Uniplemented feature');
            },
            showCustomModel: function (opts) {
                if (opts.msg) {
                    throw new Error('Argument Exception. Define model instead of message!');
                }

                if (!opts.model) {
                    throw new Error('Argument Exception. Model is not defined.');
                }

                var dialog = new Dialog(opts);
                return dialog.show();
            }
        };
    });
