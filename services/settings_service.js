'use strict'
const db = require('../db/db');

class settings_service {
    process(event) {
        if (event.path == 'getRegions') {
            return this.getRegions();
        } else if (event.path == 'getCountries') {
            return this.getCountries(event.region);
        } else if (event.path == 'getLocations') {
            return this.getLocations(event.country);
        } else if (event.path == 'getBuildings') {
            return this.getBuildings(event.loc);
        } else if (event.path == 'getFloors') {
            return this.getFloors(event.loc, event.building);
        } else if (event.path == 'setUserSettings') {
            return this.setUserSettings(event.pmfkey, event.region, event.country, event.loc, event.building, event.floor);
        }
    }

    getRegions() {
        return new Promise(function (resolve, reject) {
            db.getRegions().then(function (data) {
                var regions = [];
                for (var i = 0; i < data.length; i++) {
                    if (regions.indexOf(data[i].regions.S) == -1) {
                        regions.push(data[i].regions.S);
                        console.log(data[i].regions.S);
                    }
                }
                return resolve(regions);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    getCountries(region) {
        return new Promise(function (resolve, reject) {
            db.getCountries(region).then(function (data) {
                var countries = [];
                for (var i = 0; i < data.length; i++) {
                    if (countries.indexOf(data[i].country.S) == -1) {
                        countries.push(data[i].country.S);
                    }
                }
                return resolve(countries);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    getLocations(country) {
        return new Promise(function (resolve, reject) {
            db.getLocations(country).then(function (data) {
                var locations = [];
                for (var i = 0; i < data.length; i++) {
                    if (locations.indexOf(data[i].loc.S) == -1) {
                        locations.push(data[i].loc.S);
                    }
                }
                return resolve(locations);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    getBuildings(loc) {
        return new Promise(function (resolve, reject) {
            db.getBuildings(loc).then(function (data) {
                var buildings = [];
                for (var i = 0; i < data.length; i++) {
                    if (buildings.indexOf(data[i].building.N) == -1) {
                        buildings.push(data[i].building.N);
                    }
                }
                return resolve(buildings);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    getFloors(loc, building) {
        return new Promise(function (resolve, reject) {
            db.getFloors(loc, building).then(function (data) {
                var floors = [];
                for (var i = 0; i < data.length; i++) {
                    if (floors.indexOf("Floor " + data[i].floor.N) == -1) {
                        floors.push("Floor " + data[i].floor.N);
                    }
                }
                floors.sort();
                return resolve(floors);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }

    setUserSettings(pmfkey, region, country, loc, building, floor) {
        return new Promise(function (resolve, reject) {
            db.setUserSettings(pmfkey, region, country, loc, building, floor).then(function (data) {
                var status = data["floor"].N;
                for (var i = 0; i < data.length; i++) {
                    if (data["floor"].N == floor) {
                        status = "Updated";
                        break;
                    }
                }
                return resolve(status);
            }).catch(function (error) {
                return reject(error)
            })
        })
    }
}

module.exports = new settings_service();