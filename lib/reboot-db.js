var Q = require('q');
var Datastore = require('nedb');
var db = {};

function initDB(dbName, dbLocation) {
    var deferred = Q.defer();

    try {
        db[dbName] = new Datastore(dbLocation);
        db[dbName].loadDatabase(function (err) {
            console.log('db loaded: ' + dbName);
            deferred.resolve('db loaded: ' + dbName);
        });
    }
    catch(error) {
        deferred.reject(new Error(error));
    }

    return deferred.promise;
}

function find(dbName, query) {
    var deferred = Q.defer();

    try {
        db[dbName].loadDatabase(function (err) {
            db[dbName].find(query, function (err, docs) {
                deferred.resolve(docs);
            });
        });
    }
    catch(error) {
        deferred.reject(new Error(error));
    }

    return deferred.promise;
}

function insert(dbName, doc) {
    db[dbName].loadDatabase(function (err) {
        db[dbName].insert(doc);
    });
}

function update(dbName, query, doc) {
    var deferred = Q.defer();

    try {
        db[dbName].loadDatabase(function (err) {
            db[dbName].update(query, doc, {}, function (err, numReplaced) {
                deferred.resolve(numReplaced);
            });
        });
    }
    catch(error) {
        deferred.reject(new Error(error));
    }

    return deferred.promise;
}

function remove(dbName, query) {
    var deferred = Q.defer();

    try {
        db[dbName].loadDatabase(function (err) {
            db[dbName].remove(query, { multi : true}, function (err, numRemoved) {
                deferred.resolve(numRemoved);
            });
        });
    }
    catch(error) {
        deferred.reject(new Error(error));
    }

    return deferred.promise;
}

function getDB() {
    return db;
}

//db.users = new Datastore(__base + 'db/users.db');
//db.cars = new Datastore(__base + 'db/cars.db');
//
//db.users.loadDatabase(function (err) {    // Callback is optional
//    // Now commands will be executed
//    console.log('users: db loaded... manually');
//});
//
//db.cars.loadDatabase(function (err) {    // Callback is optional
//    // Now commands will be executed
//    console.log('cars: db loaded... manually');
//
//    var doc = {
//        hello: 'world',
//        n: 5,
//        today: new Date(),
//        nedbIsAwesome: true,
//        notthere: null,
//        notToBeSaved: undefined,  // Will not be saved
//        fruits: [ 'apple', 'orange', 'pear' ],
//        infos: { name: 'nedb' }
//    };
//
//    var doc2 = {
//        hello: 'wassup',
//        n: 7,
//        today: new Date(),
//        nedbIsAwesome: true,
//        notthere: null,
//        notToBeSaved: undefined,  // Will not be saved
//        fruits: [ 'apple', 'orange', 'pear' ],
//        infos: { name: 'nedb2' }
//    };
//
//    db.cars.insert(doc);
//    db.cars.insert(doc2);
//
//});

module.exports.initDB = initDB;
module.exports.find = find;
module.exports.insert = insert;
module.exports.update = update;
module.exports.getDB = getDB;
module.exports.remove = remove;
