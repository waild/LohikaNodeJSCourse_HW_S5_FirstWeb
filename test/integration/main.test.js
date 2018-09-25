process.env.NODE_ENV = 'development';

const chai = require('chai');

const should = chai.should();
const request = require('supertest');


const app = require('../../app/main');
const knex = require('../../db');

describe('routes : reservations', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  describe('GET /api/reservations/:id', () => {
    it('should respond with details', (done) => {
      request(app)
        .get('/api/reservations/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          response.body.should.eql({
            reservation: {
              id: '1',
              guests: 2,
              start: '2016-09-08T21:00:00.000Z',
              end: '2016-09-08T22:00:00.000Z',
              table: {
                number: 1,
                capacity: 2,
              },
            },
          });
          done();
        });
    });
    it('should respond 400 status', (done) => {
      request(app)
        .get('/api/reservations/999')
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('POST /api/reservations', () => {
    it('should create reservation', (done) => {
      request(app)
        .post('/api/reservations')
        .send({ reservation: { guests: 1, time: '2018-05-17T18:48:00Z', duration: 1.5 } })
        .expect(201)
        .end((err, resp) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should respond 400 status on wrong guests count', (done) => {
      request(app)
        .post('/api/reservations')
        .send({ reservation: { guests: -1, time: '2018-09-17T18:48:00Z', duration: 1.5 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status on wrong time format', (done) => {
      request(app)
        .post('/api/reservations')
        .send({ reservation: { guests: -1, time: '2018:09:17:18:48:00Z', duration: 1.5 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status on wrong duration', (done) => {
      request(app)
        .post('/api/reservations')
        .send({ reservation: { guests: -1, time: '2018:09:17:18:48:00Z', duration: 0.4 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('PUT /api/reservations', () => {
    it('should update reservation', (done) => {
      request(app)
        .put('/api/reservations/1')
        .send({ reservation: { guests: 1, time: '2018-05-17T18:48:00Z', duration: 2 } })
        .set('Content-Type', 'application/json')
        .expect(201)
        .end((err, resp) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should respond 400 status on wrong guests count', (done) => {
      request(app)
        .put('/api/reservations/1')
        .send({ reservation: { guests: -1, time: '2018-09-17T18:48:00Z', duration: 1.5 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status on wrong time format', (done) => {
      request(app)
        .put('/api/reservations/1')
        .send({ reservation: { guests: -1, time: '2018:09:17:18:48:00Z', duration: 1.5 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status on wrong duration', (done) => {
      request(app)
        .put('/api/reservations/1')
        .send({ reservation: { guests: -1, time: '2018:09:17:18:48:00Z', duration: 0.4 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status if reservation doesn exist', (done) => {
      request(app)
        .put('/api/reservations/999')
        .send({ reservation: { guests: -1, time: '2018:09:17:18:48:00Z', duration: 0.4 } })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Delete /api/reservations/:id', () => {
    it('should delete reservation', (done) => {
      request(app)
        .delete('/api/reservations/1')
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
    it('should respond 400 status if reservation doesn exist', (done) => {
      request(app)
        .delete('/api/reservations/999')
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
