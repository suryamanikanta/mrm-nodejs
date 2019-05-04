'use strict'
var shuffle = require('shuffle-array')

class new_booking_db {
    getAvailableConfRoomId(dynamodb, params) {
        return new Promise((resolve, reject) => {
            this.getConfIds(dynamodb, params).then(data => {
                var ids = [];
                for (var i = 0; i < data.length; i++) {
                    if (ids.indexOf(data[i].id.N) == -1) {
                        ids.push(data[i].id.N);
                    }
                }
                return ids;
            }).then(data => {
                console.log(data);
                shuffle(data);
                console.log(data);
                data.forEach(element => {
                    this.findIfRoomIsVacant(dynamodb, element, params).then(function(data) {
                        console.log(element, data);
                        // if (data.Items.length == 0) {
                        resolve({
                            "id": element
                        });
                        // }
                    }).catch(function(error) {
                        reject(error);
                    })
                });
            });
        })
    }

    //fetch all conf ids based on region, country, location, building and floor
    getConfIds(dynamodb, params) {
        return new Promise((resolve, reject) => {
            console.log('params ', params);
            dynamodb.scan({
                TableName: "MRM_Master",
                ExpressionAttributeValues: {
                    ":regions": {
                        S: params.regions
                    },
                    ":country": {
                        S: params.country
                    },
                    ":loc": {
                        S: params.loc
                    },
                    ":building": {
                        N: params.building
                    },
                    ":floor": {
                        N: params.floor
                    }
                },
                FilterExpression: "regions = :regions and " +
                    "country = :country and " +
                    "loc = :loc and " +
                    "building = :building and " +
                    "floor = :floor ",
                ProjectionExpression: "id"
            }, function(error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data.Items);
            })
        });
    }

    findIfRoomIsVacant(dynamodb, id, params) {
            return new Promise((resolve, reject) => {
                dynamodb.scan({
                    TableName: "MRM_Bookings",
                    ExpressionAttributeValues: {
                        ":id": {
                            N: id
                        },
                        ":status": {
                            S: "booked"
                        },
                        ":fromdate": {
                            N: params.from
                        },
                        ":todate": {
                            S: params.to
                        }
                    },
                    FilterExpression: "(( :fromdate between from_datetime and to_datetime ) or (:todate between from_datetime and to_datetime)) and mrm_master_id = :id and status_ = :status",
                    // ProjectionExpression: "loc"
                }, function(error, data) {
                    if (error) {
                        reject(error);
                    }
                    // console.log(data);
                    resolve(data);
                })
            });
        }
        //fetch region, country, location, building and floor of conf room by id
    getConfDetailsById(dynamodb, id) {
        return new Promise((resolve, reject) => {
            console.log('id ', id);
            dynamodb.scan({
                TableName: "MRM_Master",
                ExpressionAttributeValues: {
                    ":id": {
                        N: id
                    }
                },
                FilterExpression: "id = :id "
            }, function(error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data.Items);
            })
        });
    }
    newBooking(dynamodb, params) {
        var id = new Date().getTime();
        params = {
            "from_datetime": {
                "N": params.fromdate
            },
            "id": {
                "N": "" + id
            },
            "mrm_master_id": {
                "N": params.mrm_master_id
            },
            "pmfkey": {
                "S": params.pmfkey
            },
            "status_": {
                "S": "booked"
            },
            "to_datetime": {
                "N": params.todate
            }
        }
        return new Promise((resolve, reject) => {
            dynamodb.putItem({
                TableName: "MRM_Bookings",
                Item: params
            }, function(error, data) {
                if (error) {
                    reject(error);
                }
                // console.log(data);
                resolve(data);
            })
        });
    }
    getMyBookings(dynamodb, params) {
        return new Promise((resolve, reject) => {
            console.log('params ', params);
            dynamodb.scan({
                TableName: "MRM_Bookings",
                ExpressionAttributeValues: {
                    ":pmfkey": {
                        S: params.pmfkey
                    },
                    ":status": {
                        S: "booked"
                    }
                },
                FilterExpression: "pmfkey = :pmfkey and " +
                    "status_ = :status "
                    // ProjectionExpression: "loc"
            }, function(error, data) {
                if (error) {
                    reject(error);
                }
                console.log(' Bookings: ', data);
                resolve(data.Items);
            })
        });
    }
}


module.exports = new new_booking_db();