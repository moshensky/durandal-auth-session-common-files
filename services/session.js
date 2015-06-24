define(['plugins/router', 'knockout', 'jquery'],
    function (router, ko, $) {
    'use strict';

    $.arrayIntersect = function (array1, array2) {
        return $.grep(array1, function (i) {
            return $.inArray(i, array2) > -1;
        });
    };

    var constant = {
        sessionStorageBackup: 'sessionStorageBackup',
        accessToken: 'accessToken',
        userRoles: 'userRoles',
        userName: 'userName',
        studentId: 'studentId',
        studentFacultyNumber: 'studentFacultyNumber'
    };

    function restoreSessionStorageFromLocalStorage() {
        var backupText = localStorage[constant.sessionStorageBackup],
            backup;

        if (backupText) {
            backup = JSON.parse(backupText);

            for (var key in backup) {
                if(backup.hasOwnProperty(key)) {
                    sessionStorage[key] = backup[key];
                }                
            }

            localStorage.removeItem(constant.sessionStorageBackup);
        }
    }

    function setAccessToken(accessToken, persistent) {
        if (persistent) {
            localStorage[constant.accessToken] = accessToken;
        } else {
            sessionStorage[constant.accessToken] = accessToken;
        }
    }

    var SessionModel = function SessionModel() {
        this.studentId = ko.observable(undefined);
        this.studentFacultyNumber = ko.observable(undefined);

        this.userName = ko.observable(undefined);
        this.email = ko.observable(undefined);
        this.isLoggedIn = ko.observable(false);
        this.isBusy = ko.observable(false);
        this.userRoles = ko.observableArray();

        restoreSessionStorageFromLocalStorage();
    };
    
    SessionModel.prototype = {
        setUser: function (user, remember) {
            /*jshint camelcase: false */

            if (user) {
                this.studentId(user.eStudentId);
                this.studentFacultyNumber(user.eStudentFacultyNumber);

                this.userName(user.userName);
                this.email(user.email);

                if (user.hasOwnProperty('access_token')) {
                    setAccessToken(user.access_token, remember);
                } else if (user.hasOwnProperty(constant.accessToken)) {
                    setAccessToken(user.access_token, remember);
                }

                //TODO: check logic flow! :)
                //TODO: Fix! read from storrage!
                if (user.userRoles !== undefined) {
                    // persist
                    if (remember) {
                        localStorage[constant.userRoles] = user.userRoles;
                        localStorage[constant.userName] = user.userName;
                        localStorage[constant.studentId] = user.eStudentId;
                        localStorage[constant.studentFacultyNumber] = user.eStudentFacultyNumber;
                        //throw new Error('Unimplemented feautrue!!!');
                    } else {
                        sessionStorage[constant.userRoles] = user.userRoles;
                        sessionStorage[constant.userName] = user.userName;
                        sessionStorage[constant.studentId] = user.eStudentId;
                        sessionStorage[constant.studentFacultyNumber] = user.eStudentFacultyNumber;
                    }

                    var roles = user.userRoles.split(',');

                    var self = this;
                    $.each(roles, function (i, v) {
                        self.userRoles.push(v);
                    });
                } else {
                    throw new Error('User must have roles!');
                }

                this.isLoggedIn(true);                
            }
        },
        clearUser: function () {
            // clear access token
            localStorage.removeItem(constant.accessToken);
            sessionStorage.removeItem(constant.accessToken);

            this.studentId('');
            this.studentFacultyNumber('');

            this.userName('');
            this.email('');
            this.userRoles.removeAll();
            this.isLoggedIn(false);
        },
        userIsInRole: function (requiredRole) {
            if (requiredRole === undefined) {
                return true;
            } else if (this.userRoles() === undefined) {
                return false;
            } else {
                if ($.isArray(requiredRole)) {
                    if (requiredRole.length === 0) {
                        return true;
                    } else {
                        return $.arrayIntersect(this.userRoles(), requiredRole).length > 0;
                    }
                } else {
                    return $.inArray(requiredRole, this.userRoles()) > -1;
                }
            }                       
        },
        userRemembered: function () {
            var isInSessionStorage = sessionStorage[constant.accessToken] !== undefined;
            var isInLocalStorage = localStorage[constant.accessToken] !== undefined;
            var result = isInSessionStorage || isInLocalStorage;

            return result;
        },
        restoreData: function () {
            var userRoles = localStorage[constant.userRoles] || sessionStorage[constant.userRoles];
            var roles = userRoles.split(',');
            var self = this;
            $.each(roles, function (i, v) {
                self.userRoles.push(v);
            });

            this.isLoggedIn(true);

            this.studentId(localStorage[constant.studentId] || sessionStorage[constant.studentId]);
            this.studentFacultyNumber(localStorage[constant.studentFacultyNumber] || sessionStorage[constant.studentFacultyNumber]);
            this.userName(localStorage[constant.userName] || sessionStorage[constant.userName]);
        },
        rememberedToken: function () {
            return sessionStorage[constant.accessToken] || localStorage[constant.accessToken];
        },
        archiveSessionStorageToLocalStorage: function () {
            var backup = {};

            for (var i = 0; i < sessionStorage.length; i+=1) {
                backup[sessionStorage.key(i)] = sessionStorage[sessionStorage.key(i)];
            }

            localStorage[constant.sessionStorageBackup] = JSON.stringify(backup);
            sessionStorage.clear();
        }      
    };

    var session = new SessionModel();
    return session;
});
