"use strict";
import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";

import app from "../../app";

const request = supertest(app);
let token;

describe("User Authentication", () => {
  before(done => {
    mongoose.connect(process.env.TESTDB_URL);
    const db = mongoose.connection;
    db.dropDatabase();
    db.once("open", () => {
      done();
    });
  });

  describe("handles user registration (/api/v1/signup)", () => {
    it("should return 201 on successful signup", (done) => {
      request
        .post("/api/v1/signup")
        .send({
          name: "Jane Doe",
          email: "janedoe@gmail.com",
          password: "password"
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal("User created successfully");
          expect(res.body.name).to.equal("Jane Doe");
          expect(res.body.email).to.equal("janedoe@gmail.com");
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 409 when user signs up with existing email', (done) => {
      request
        .post('/api/v1/signup')
        .send({
          email: 'janedoe@gmail.com',
          name: 'John Doe',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message)
            .to.equal('Email already exist');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 400 when user doesn\'t provide an email', (done) => {
      request
        .post('/api/v1/signup')
        .send({
          name: 'Clara',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.property('email');
          expect(res.body.errors.email)
            .to.equal('email field is required');
          done();
        });
    });

    it('should return 400 when user doesn\'t provide name', (done) => {
      request
        .post('/api/v1/signup')
        .send({
          email: 'john@gmail.com',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.property('name');
          expect(res.body.errors.name)
            .to.equal('name field is required');
          done();
        });
    });

    it('should return 400 when user doesn\'t provide password', (done) => {
      request
        .post('/api/v1/signup')
        .send({
          name: 'John',
          email: 'john@gmail.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.property('password');
          expect(res.body.errors.password)
            .to.equal('password field is required');
          done();
        });
    });

    it('should return 400 when user provides an invalid email', (done) => {
      request
        .post('/api/v1/signup')
        .send({
          name: 'John',
          email: 'enodi',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Invalid email');
          done();
        });
    });
  });

  describe('handles user signin (/api/v1/signin)', () => {
    it('should return 200 when user signs in successfully', (done) => {
      request
        .post('/api/v1/signin')
        .send({
          email: 'janedoe@gmail.com',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Signin successful');
          expect(res.body).to.have.all.keys('message', 'token');
          token = res.body.token;
          done();
        });
    });

    it('should return 404 when user signs in with invalid email', (done) => {
      request
        .post('/api/v1/signin')
        .send({
          email: 'jane',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid credentials');
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 404 when user signs in with wrong password', (done) => {
      request
        .post('/api/v1/signin')
        .send({
          email: 'janedoe@gmail.com',
          password: 'password12345',
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid credentials');
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return 400 when no email is supplied', (done) => {
      request
        .post('/api/v1/signin')
        .send({
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.equal('email field is required');
          expect(res.body.errors).to.have.property('email');
          done();
        });
    });

    it('should return 400 when no password is supplied', (done) => {
      request
        .post('/api/v1/signin')
        .send({
          email: 'janedoe@gmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.password).to.equal('password field is required');
          expect(res.body.errors).to.have.property('password');
          done();
        });
    });
  });
});

describe('GET /api/v1/search-location', () => {
  describe('handles searching a location', () => {
    it('should return 200 when a city is found', (done) => {
      request
        .get('/api/v1/search-location')
        .set('x-access-token', token)
        .query({ location: 'lagos' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data.sys.country).to.equal("NG");
          expect(res.body.data.name).to.equal('Lagos');
          done();
        });
    });

    it('should return error when an invalid city is passed', (done) => {
      request
        .get('/api/v1/search-location')
        .set('x-access-token', token)
        .query({ location: 'wrong-location' })
        .end((err, res) => {
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.message).to.equal('city not found');
          done();
        });
    });

    it('should return 401 when an unauthenticated user tries to access this route', (done) => {
      request
        .get('/api/v1/search-location')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message)
            .to.equal('Access denied, Authentication token does not exist');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.all.keys('success', 'message');
          done();
        });
    });

    it('should return 401 when an invalid token is passed', (done) => {
      request
        .get('/api/v1/search-location')
        .set('x-access-token', 'ujefjUDFG90W_nsdjdk478sj')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to
            .equal('Failed to Authenticate Token');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.all.keys('success', 'message', 'error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error).to.have.all.keys('name', 'message');
          expect(res.body.error.name).to.equal('JsonWebTokenError');
          expect(res.body.error.message).to.equal('jwt malformed');
          done();
        });
    });
  });
});
