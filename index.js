var express = require('express');
var _ = require('lodash');

var mock = {};
var db = {};
var router = mock.router = express.Router();

mock.collection = function(route, data){
    var isNumber = function(value){
        return /^\d+$/.test(value);
    };

    var post_data = function(route, data){
        var id = _.max(db[route], 'id');

        if(id.id) id = id.id; else id = 0;

        if(_.isArray(data)) {
            _(data).each(function(item){
                if(!item.id) item.id = ++id;
                db[route].push(item);
            })
        } else {
            if(!data.id) data.id = ++id;
            db[route].push(data);
        }

        return db[route];
    };

    db[route] = [];
    if(data) post_data(route, data);

    router.get(route, function(req, res){
        res.json(200, db[route]);
    });

    router.get(route  + '/:id', function(req, res){
        var id = req.params.id;
        if(isNumber(id)) id = Number(id);

        var result = _.find(db[route], {id: id});

        res.json(result || {});
    });

    router.route(route  + '/:id')
        .put(function(req, res){
            var id = req.params.id;
            if(isNumber(id)) id = Number(id);

            var result = _.find(db[route], {id: id});
            var index = _.indexOf(db[route], result);

            req.body.id = result.id;
            result = db[route][index] = req.body;

            res.json(201, result);
        })
        .patch(function(req, res){
            var id = req.params.id;
            if(isNumber(id)) id = Number(id);

            var result = _.find(db[route], {id: id});

            _.extend(result, req.body);

            res.json(201, result);
        });

    router.post(route, function(req, res){
        post_data(route, req.body);
        res.json(201, db[route]);
    });

    router.delete(route  + '/:id', function(req, res){
        var id = req.params.id;
        if(isNumber(id)) id = Number(id);

        _.remove(db[route], {id: id});

        res.send(204);
    });
};

mock.resource = function(route, data, code) {
    db[route] = data;

    router.get(route, function(req, res){
        res.json(code || 200, db[route]);
    });
};

router.get('/', function(req, res){
    var result = _(db).keys().map(function(item){ return '/api' + item}).value();

    res.json({ resources: result });
});

module.exports = mock;