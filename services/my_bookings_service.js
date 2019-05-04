'use strict'
const db = require('../db/db');

class my_booking_service {
    process(event) {
        if (event.path == 'getAvailableRoom') {
            return this.getAvailableRoom(event);
        }

    }

    getMyBookings(event) {
        var params = {
            pmfkey: event.pmfkey,
            status: event.status
        }

        return new Promise(function (resolve, reject) {
            db.getMybookings(params).then(function (data) {
                console.log(data);
                return resolve(data);
            }).catch(function (error) {
                return reject(error)
            })
        });
    }
}

    module.exports = new my_booking_service();