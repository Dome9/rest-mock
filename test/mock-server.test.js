var chai = require('chai');
var expect = chai.expect;
var lib = require('../');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');

var app, mock;

beforeEach(function(){
    app = express();
    mock = new lib();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(mock.middleware());
});

describe('Rest Mock', function(){
    describe('Resource', function(){

        it('mock should have a resource function', function(){
            expect(mock.resource).to.be.a('function');
        });

        it('should create a new resource', function(done){
            mock.resource('/test');

            request(app)
                .get('/')
                .expect(200, '{"resources":["/test"]}', done)
        });

        it('should create a new resource with data', function(done){
            mock.resource('/test', { test: true });

            request(app)
                .get('/test')
                .expect(200, '{"test":true}', done)
        });

        it('should update resource with new data', function(done){
            mock.resource('/test', { test: true });

            request(app)
                .put('/test')
                .send({ data: 'new' })
                .expect(201, '{"data":"new"}', done)
        });

        it('should patch resource with partial data', function(done){
            mock.resource('/test', { test: true, partial: false });

            request(app)
                .patch('/test')
                .send({ partial: true })
                .expect(201, '{"test":true,"partial":true}', done)
        })
    });

    describe('Collection', function(){
        it('mock should have a collection function', function(){
            expect(mock.collection).to.be.a('function');
        })
    });

    describe('Mock Middleware', function(){
        it('should have a middleware function', function(){
            expect(mock.middleware).to.be.a('function');
        });
    });

    describe('Express App', function(){
        it('should get api resources', function(done){
            request(app)
                .get('/')
                .expect(200, '{"resources":[]}', done);
        })
    })
});