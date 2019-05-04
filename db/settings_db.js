'use strict'

class settings_db {
    getRegions(dynamodb){
        return new Promise((resolve, reject) => {
            var params = {
               ProjectionExpression: 'regions',
               TableName: 'MRM_Master'
              };

            dynamodb.scan(params, function(err, data){
                if (err) {
                    console.log("Error", err);
                  } else {
                      return resolve(data.Items);
                  }
            })            
        })
    }

    getCountries(dynamodb, region){
        return new Promise((resolve, reject) => {
            dynamodb.scan({
                ExpressionAttributeValues: {
                    ":region": {
                        S: region
                    }
                },
                ProjectionExpression: "country",
                FilterExpression: "regions = :region",
                TableName: "MRM_Master"
            }, function(error, data){
                if(error){
                    reject(error);
                }
               return resolve(data.Items);
            })
        })
    }
    
    getLocations(dynamodb, country){
        console.log("requested country : ",country);
        return new Promise((resolve, reject) => {
            dynamodb.scan({
                TableName: "MRM_Master",
                ExpressionAttributeValues: {
                    ":country": {
                        S: country
                    }
                },
                FilterExpression: "country = :country",
                ProjectionExpression: "loc"
            }, function(error, data){
                if(error){
                    reject(error);
                }
                return resolve(data.Items);
            })
        })
    }

    getBuilding(dynamodb,loc){
        return new Promise((resolve, reject) => {
            dynamodb.scan({
                TableName: "MRM_Master",
                ExpressionAttributeValues: {
                    ":loc": {
                        S: loc
                    }
                },
                FilterExpression: "loc = :loc",
                ProjectionExpression: "building"
            }, function(error, data){
                if(error){
                    reject(error);
                }
                return resolve(data.Items);
            })
        })
    }

    getFloors(dynamodb,loc,building){
        return new Promise((resolve, reject) => {
            dynamodb.scan({
                TableName: "MRM_Master",
                ExpressionAttributeValues: {
                    ":loc": {
                        S: loc
                    },
                    ":building":{
                        N: building
                    }
                },
                FilterExpression: "loc=:loc and building=:building",
                ProjectionExpression: "floor"
            }, function(error, data){
                if(error){
                    console.log(error);
                    reject(error);
                }
                
                return resolve(data.Items);
            })
        })
    }

        setUserSettings(dynamodb,pmfkey,region,country,loc,building,floor){
              var params = {
                    "regions": {"N": region},
                    "country" :{"S":country},
                    "loc": {"S":loc},
                    "building":{"N":building},
                    "floor": {"N":floor},
                    "pmfkey" : {"S":pmfkey}
                }
                return new Promise((resolve, reject) => {
                    dynamodb.putItem({
                        TableName: "MRM_User",
                        Item: params
                    }, function (error, data) {
                        if (error) {
                            reject(error);
                        }
                        console.log(data);
                        resolve(data);
                    })
                });           
        }
}

module.exports = new settings_db();