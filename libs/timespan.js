/*global define */
define(['moment'],
    function (moment) {
        'use strict';

        var Timespan = function Timespan(timespan) {
            var hours = 0;
            var minutes = 0;

            if (moment.isMoment(timespan)) {
                timespan = timespan.format('HH:mm');
            }

            if (typeof timespan === 'string') {
                var fragments = timespan.split(':');
                if (fragments.length >= 2) {
                    hours = parseInt(fragments[0], 10);
                    minutes = parseInt(fragments[1], 10);

                    if (hours < 0 || hours > 23) {
                        hours = 0;
                    }

                    if (minutes < 0 || minutes > 59) {
                        minutes = 0;
                    }
                }
            }

            this.hours = hours;
            this.minutes = minutes;

            this._isATimespanObject = true;
        };

        Timespan.prototype.toString = function () {
            var result = '';
            if (this.hours < 10) {
                result += '0';
            }

            result += this.hours + ':';

            if (this.minutes < 10) {
                result += '0';
            }

            result += this.minutes;

            return result;
        };

        Timespan.prototype.toMoment = function () {
            var momentDate = moment({
                hour: this.hours,
                minute: this.minutes
            });

            return momentDate;
        };

        Timespan.prototype.addMinutes = function (minutes) {
            var addedHours,
                addedMinutes;

            addedHours = Math.floor(minutes / 60);
            addedMinutes = minutes % 60;

            this.hours += addedHours;
            this.minutes += addedMinutes;

            this.hours += Math.floor(this.minutes / 60);
            this.minutes = this.minutes % 60;

            return this;
        };

        Timespan.prototype.addHours = function (hours) {
            this.hours += hours;
            return this;
        };

        return Timespan;
    });