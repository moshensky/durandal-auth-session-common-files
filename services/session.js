define(['knockout'],
  function (ko) {
    'use strict';

    // todo: read from config
    var constant = {
      appData: 'app_data'
    };

    var SessionModel = function SessionModel() {
      this.isLoggedIn = ko.observable(false);
      this.userName = ko.observable(undefined);
      this.initUserData();

      if (this.userRemembered()) {
        this.restoreData();
      }
    };

    SessionModel.prototype = {
      initUserData: function () {
        this.userId = undefined;
        this.userName(undefined);
        this.userClaims = [];
        this.userRoles = [];
        this.userAccessRights = [];

        this.isLoggedIn(false);
        this.isBusy = ko.observable(false);
      },

      setUser: function (data) {
        if (data) {
          localStorage[constant.appData] = JSON.stringify(data);
          this.restoreData();
        }
      },

      clearUser: function () {
        localStorage.clear();
        this.initUserData();
      },

      userHasAccessRight: function (requiredAccessRight) {
        return this.userAccessRights[requiredAccessRight] === true;
      },

      userHasAllAccessRights: function (requiredAccessRights) {
        return requiredAccessRights.every(function (accessRight) {
          return this.userHasAccessRight(accessRight);
        }, this);
      },

      userHasRole: function (requredRole) {
        return this.userRoles[requredRole] === true;
      },

      userHasAtLeastOneRole: function (requiredRoles) {
        return requiredRoles.some(function (requiredRole) {
          return this.userHasRole(requiredRole);
        }, this);
      },

      userHasClaim: function (claimType) {
        return this.userClaims[claimType] !== undefined;
      },

      getUserClaim: function (claimType) {
        return this.userClaims[claimType];
      },

      isUserLoggedIn: function () {
        return this.isLoggedIn() === true;
      },

      userRemembered: function () {
        return localStorage[constant.appData] !== undefined;
      },

      restoreData: function () {
        var data = JSON.parse(localStorage[constant.appData]);

        this.userId = data.userId;
        this.userName(data.userName);
        this.userClaims = data.userClaims.reduce(function (hash, userClaim) {
          hash[userClaim.type] = userClaim.value;
          return hash;
        }, {});
        this.userRoles = data.userRoles.reduce(function (hash, userRole) {
          hash[userRole] = true;
          return hash;
        }, {});
        this.userAccessRights = data.userAccessRights.reduce(function (hash, accessRight) {
          hash[accessRight] = true;
          return hash;
        }, {});

        this.isLoggedIn(true);
      },

      rememberedToken: function () {
        return JSON.parse(localStorage[constant.appData] || '{}').token;
      },

      getUserName: function () {
        return this.userName;
      }
    };

    return new SessionModel();
  });

