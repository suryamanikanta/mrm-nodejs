'use strict'
const db = require('../db/db');

class new_booking_service {
    process(event) {
        if (event.path == 'getAvailableConfRoomId') {
            return this.getAvailableConfRoomId(event);
        } else if (event.path == 'newBooking') {
            return this.newBooking(event);
        } else if (event.path == 'getConfDetailsById') {
            return this.getConfDetailsById(event.id);
        }
    }

    getAvailableConfRoomId(event) {
        return new Promise(function (resolve, reject) {
            db.getAvailableConfRoomId(params).then(function (data) {
                console.log(event);
                return resolve(data);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    getConfDetailsById(id) {
        return new Promise((resolve, reject) => {
            db.getConfDetailsById(id).then(data => {
                resolve(data);
            }).catch(data => {
                reject(data);
            })
        })
    }

    newBooking(event) {
        return new Promise(function (resolve, reject) {
            db.newBooking(event).then(function (data) {
                console.log(data);
                return resolve(data);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }
}

module.exports = new new_booking_service();