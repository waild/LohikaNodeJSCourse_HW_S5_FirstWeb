const sinon = require('sinon');
const chai = require('chai');

const expect = chai.expect;

const reservationRepo = require('../../app/repositories/reservationRepo');
const reservationService = require('../../app/services/reservationsService');

describe('Reservation Service:', () => {
  let reservationRepoMock;
  before(() => {
    reservationRepoMock = sinon.mock(reservationRepo);
  });
  afterEach(() => {

  });
  after(() => {
    reservationRepoMock.restore();
  });
  describe('delete', () => {
    it('should call repository properly', () => {
      const reservationId = 1;
      reservationRepoMock.expects('delete').once().withArgs(reservationId);
      reservationService.delete(reservationId);
    });
  });
  describe('getInfo', () => {
    it('should call repository properly and return valid data', async () => {
      const reservationId = 1;
      const data = {
        guests: 1,
        start: '2018:09:17:18:48:00Z',
        end: '2018:09:47:18:48:00Z',
        number: 4,
        capacity: 4,
      };
      reservationRepoMock.expects('getInfo').once().withArgs(reservationId).returns(Promise.resolve(data));
      const info = await reservationService.getInfo(reservationId);
      expect(info).to.eql(
        {
          reservation: {
            id: reservationId,
            guests: 1,
            start: '2018:09:17:18:48:00Z',
            end: '2018:09:47:18:48:00Z',
            table: {
              number: 4,
              capacity: 4,
            },
          },
        },
      );
    });
    it('should call repository properly and return NULL if data doesnt exist', async () => {
      const reservationId = 1;
      const data = null;
      reservationRepoMock.expects('getInfo').once().withArgs(reservationId).returns(Promise.resolve(data));
      const info = await reservationService.getInfo(reservationId);
      expect(info).to.eql(null);
    });
  });
  describe('create', () => {
    it('should call repository properly', async () => {
      const request = { guests: 10, time: '2018-09-17T18:48:00Z', duration: 1.5 };
      const data = [{ capacity: 2, id: 1 }, { capacity: 10, id: 2 }];
      const start = new Date(request.time);
      const end = new Date(request.time);
      end.setSeconds(end.getSeconds() + request.duration * 60 * 60);

      reservationRepoMock.expects('getFreeTablesForPeriod').once().withArgs(start, end).returns(Promise.resolve(data));
      reservationRepoMock.expects('create').once().withArgs({
        start,
        end,
        guests: request.guests,
        table_id: 2,
      }).returns(Promise.resolve({}));
      await reservationService.create(request);
    });
    it('should return exception on invalid data', async () => {
      const request = { guests: -1, time: '2018-09-17T18:48:00Z', duration: 1.5 };
      const data = [{ capacity: 2, id: 1 }, { capacity: 10, id: 2 }];
      reservationRepoMock.expects('getFreeTablesForPeriod').returns(Promise.resolve(data));
      reservationRepoMock.expects('create').returns(Promise.resolve({}));
      try {
        await reservationService.create(request);
        throw new Error('Expected an error and didn\'t get one!');
      } catch (err) {
        const expected = 'Data is not valid';
        expect(err.message).to.eql(expected);
      }
    });
    it('should return exception if no table available', async () => {
      const request = { guests: 6, time: '2018-09-17T18:48:00Z', duration: 1.5 };
      const data = [{ capacity: 2, id: 1 }, { capacity: 4, id: 2 }];
      reservationRepoMock.expects('getFreeTablesForPeriod').returns(Promise.resolve(data));
      reservationRepoMock.expects('create').returns(Promise.resolve({}));
      try {
        await reservationService.create(request);
        throw new Error('Expected an error and didn\'t get one!');
      } catch (err) {
        const expected = 'No available table';
        expect(err.message).to.eql(expected);
      }
    });
  });
  describe('update', () => {
    it('should call repository properly', async () => {
      const reservationId = 1;
      const request = { guests: 2, time: '2016-11-21T08:00:00.000Z', duration: 1.5 };
      const data = [{ capacity: 4, id: 1 }, { capacity: 10, id: 2 }];
      const start = new Date(request.time);
      const end = new Date(request.time);
      end.setSeconds(end.getSeconds() + request.duration * 60 * 60);

      reservationRepoMock.expects('getFreeTablesForPeriodExceptCurrent').once().withArgs(start, end, reservationId).returns(Promise.resolve(data));
      reservationRepoMock.expects('update').once().withArgs(reservationId, {
        start,
        end,
        guests: request.guests,
        table_id: 2,
      }).returns(Promise.resolve({}));
      await reservationService.update(request);
    });
    it('should return exception on invalid data', async () => {
      const reservationId = 1;
      const request = { guests: 2, time: '2016-11-21T08:00:00.000Z', duration: -1 };
      const data = [{ capacity: 4, id: 1 }, { capacity: 10, id: 2 }];
      const start = new Date(request.time);
      const end = new Date(request.time);
      end.setSeconds(end.getSeconds() + request.duration * 60 * 60);

      reservationRepoMock.expects('getFreeTablesForPeriodExceptCurrent').once().withArgs(start, end, reservationId).returns(Promise.resolve(data));
      reservationRepoMock.expects('update').once().withArgs(reservationId, {
        start,
        end,
        guests: request.guests,
        table_id: 2,
      }).returns(Promise.resolve({}));
      try {
        await reservationService.update(request);
        throw new Error('Expected an error and didn\'t get one!');
      } catch (err) {
        const expected = 'Data is not valid';
        expect(err.message).to.eql(expected);
      }
    });
    it('should return exception if no table available', async () => {
      const request = { guests: 8, time: '2016-11-21T08:00:00.000Z', duration: 2 };
      const data = [{ capacity: 4, id: 1 }, { capacity: 6, id: 2 }];
      reservationRepoMock.expects('getFreeTablesForPeriodExceptCurrent').returns(Promise.resolve(data));
      reservationRepoMock.expects('update').returns(Promise.resolve({}));
      try {
        await reservationService.update(request);
        throw new Error('Expected an error and didn\'t get one!');
      } catch (err) {
        const expected = 'No available table';
        expect(err.message).to.eql(expected);
      }
    });
  });
});
