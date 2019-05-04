'use strict'
const db = require('./db/db');
const settings_service = require('./services/settings_service')
const new_booking_service = require('./services/new_booking_service')
const my_booking_service = require('./services/my_bookings_service')

function handler(event, context, callback) {
    if (!event) {
        return callback(null, "empty request");
    }
    console.log('path : ' + event.path);
    switch (event.path) {
        case 'getRegions':
        case 'getCountries':
        case 'getLocations':
        case 'getBuildings':
        case 'getFloors':
        case 'setUserSettings':
            return new Promise(function (resolve, reject) {
                settings_service.process(event).then(function (data) {
                    return resolve(data);
                }).catch(function (error) {
                    return reject(error);
                })
            });
        case 'getConfDetailsById':
        case 'getAvailableConfRoomId':
        case 'newBooking':
            return new Promise(function (resolve, reject) {
                new_booking_service.process(event).then(function (data) {
                    return resolve(data);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        case 'getMyBookings':
            return new Promise(function (resolve, reject) {
                my_booking_service.getMyBookings(event).then(function (data) {
                    return resolve(data);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        default:
            return callback(null, '(' + event.path + ') is not a valid path');
    }
}
exports.handler = handler