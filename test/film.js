// During the test the env variable is set to test
process.env.NODE.ENV = 'test';

let mongoose = require('mongoose');
let Film = require('../models/film');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();

chai.use(chaiHttp);
// Our parent block
describe('Film', () => {
    beforeEach((done) => { //before the each test we empty the database
        Film.deleteMany({}, err => {
            done();
            });
        });
    let ID;
    let testFilm = {
        "title": "Star Wars: Empire Strikes Back",
        "director": "George Lucas",
        "studio": "Lucas Films",
        "year": "1981",
        "review": "the 2nd one",
        "reviewer": "dave",
        "image": "./images/test.png"
    };

    describe('/GET film', () => {
        it('it should GET all the films', (done) => {
            chai.request(server)
                .get('/api/film')
                .set({
                    Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'  })
                .end(function(err,res) {
                    if(err){
                        console.log(err);
                    }
                    console.log("this is a test");
                    console.log(res);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
            });
        });
    });

    describe('/POST film', () => {
        it('it should Create a new film', (done) => {
            chai.request(server)
                .post('/api/film')
                .send(testFilm)
                .set({
                    Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'
                })
                .end((err,res) => {
                     console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.success.valueOf(true);
                chai.request(server)
                    .get('/api/film')
                    .set({
                        Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'
                    })
                    .end((err,res) => {
                        ID = res.body[0]._id;
                        console.log(ID);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                });
            });
        });
    });

describe('/Get film:id', () => {
    it('it should get a film by ID', (done) => {
    chai.request(server)
        .post('/api/film')
        .send(testFilm)
        .set({
            Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'
        })
        .end((err,res) => {
        console.log(res.body);
    res.should.have.status(200);
    res.body.should.be.a('Object');
    res.body.success.valueOf(true);
    chai.request(server)
        .get('/api/film')
        .set({
            Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'
        })
        .end((err,res) => {
        ID = res.body[0]._id;
    console.log(ID);
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    chai.request(server)
        .get('/api/film'+ID)
        .set({
            Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWMzZGI5Yjg0ZTkxOWQxMmNjMTQwNDBkIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwNSRYUTloajFXY3JEYWdVbm1Qay9ONnVlS1NmT3JFRFlFbWd2WWNKRnRCYkdKZnlZY3FVOGdLdSIsImNyZWF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDEtMTVUMTA6NDU6MTIuODYyWiIsIl9fdiI6MCwiaWF0IjoxNTQ3NTQ5MTEyfQ.7PhQROzkI9p56nijMiPa1szwGHmwOoX95R-QmSABhKU'
        })
        .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('Object');
    console.log("Testing Get ising ID:" + ID);
    done();

});

});
});
});
});
});