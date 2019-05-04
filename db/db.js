'use strict';
const settings_db = require('./settings_db');
const new_booking_db = require('./new_booking_db');

let AWS = require('aws-sdk');
let dynamodb = new AWS.DynamoDB({
    "region": "us-east-1",
    "accessKeyId": "AKIAIXRMUKP2XKCSHNBA",
    "secretAccessKey": "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"
});

class DB {
    getRegions() {
        return settings_db.getRegions(dynamodb);
    }

    getCountries(region) {
        return settings_db.getCountries(dynamodb, region);
    }

    getLocations(country) {
        return settings_db.getLocations(dynamodb, country);
    }

    getBuildings(loc) {
        return settings_db.getBuilding(dynamodb, loc);
    }

    getFloors(loc, building) {
        return settings_db.getFloors(dynamodb, loc, building);
    }
    setUserSettings(dynamodb, pmfkey, region, country, loc, building, floor) {
        return settings_db.setUserSettings(dynamodb, pmfkey, region, country, loc, building, floor);
    }

    async getAvailableConfRoomId(params) {
        // return new_booking_db.getAvailableConfRoomId(dynamodb, params);
        var _json = await new_booking_db.getAvailableConfRoomId(dynamodb, params);
        var details = await new_booking_db.getConfDetailsById(dynamodb, _json.id);
        return details;
    }

    getConfDetailsById(id) {
        // return new Promise((resolve, reject) => {
        //     new_booking_db.getConfDetailsById(dynamodb, id).then(data => {
        //         var keys = Object.keys(data);
        //         var arr = [];
        //         for (var i = 0; i < keys.length; i++) {
        //             arr[keys[i]] = this.parse(data[keys[i]]);
        //         };
        //         resolve(arr);
        //     })
        // })
        return new_booking_db.getConfDetailsById(dynamodb, id);
    }

    parse(object) {
        if (object.BOOL != undefined) {
            return object.BOOL;
        } else if (object.S != undefined) {
            return object.S;
        } else if (object.N != undefined) {
            return object.N;
        }
    }

    newBooking(params) {
        return new_booking_db.newBooking(dynamodb, params);
    }

    getMybookings(params) {
        return new_booking_db.getMyBookings(dynamodb, params);
    }
}

module.exports = new DB();