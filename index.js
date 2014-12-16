var express = require('express');
var _ = require('lodash');

var mock = function(){
    this.db = {};
    this.router = express.Router();

    var db = this.db;
    var router = this.router;


    router.get('/', function(req, res){

        var result = _(db).keys().map(function(item){ return req.baseUrl + item}).value();

        res.json({ resources: result });
    });
};

mock.prototype.middleware = function(){
    return this.router;
};

mock.prototype.collection = function(route, data){
    var db = this.db;
    var router = this.router;

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

        return data;
    };

    db[route] = [];
    if(data) post_data(route, data);

    router.get(route, function(req, res){
        res.json(db[route]);
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

            res.status(201).json(result);
        })
        .patch(function(req, res){
            var id = req.params.id;
            if(isNumber(id)) id = Number(id);

            var result = _.find(db[route], {id: id});

            _.assign(result, req.body);

            res.status(201).json(result);
        });

    router.post(route, function(req, res){
        res.status(201).json(post_data(route, req.body));
    });

    router.delete(route  + '/:id', function(req, res){
        var id = req.params.id;
        if(isNumber(id)) id = Number(id);

        _.remove(db[route], {id: id});

        res.status(204).send();
    });
};

mock.prototype.resource = function(route, data, code) {
    var db = this.db;
    var router = this.router;

    db[route] = data;

    router.get(route, function(req, res){
        res.status(code || 200).json(db[route]);
    });

    router.put(route, function(req, res){
        if(code !== 401 && code !== 403) db[route] = req.body;
        res.status(code || 201).json(db[route]);
    });

    router.patch(route, function(req, res){
        if(code !== 401 && code !== 403) _.assign(db[route], req.body);
        res.status(code || 201).json(db[route]);
    })
};

module.exports = mock;