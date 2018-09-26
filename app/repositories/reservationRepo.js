const knex = require('../../db');

class ReservationsRepo {
  static getInfo(id) {
    return knex('reservations')
      .join('tables', 'reservations.table_id', 'tables.id')
      .where('reservations.id', id)
      .first();
  }

  static delete(id) {
    return knex('reservations').where({
      id,
    }).delete();
  }

  static update(id, reservation) {
    return knex('reservations')
      .where({
        id,
      })
      .update(reservation);
  }

  static updateOrderUri(id, orderUri) {
    return knex('reservations')
      .where({
        id,
      })
      .update({ orderUri });
  }

  static create(reservation) {
    return knex('reservations')
      .insert(reservation);
  }

  static async getFreeTablesForPeriod(start, end) {
    const bookedTables = await knex('reservations')
      .where(function () {
        this.where(function () {
          this.where('start', '>=', start).orWhereNot('end', '<=', start);
        })
          .orWhereNot(function () {
            this.where('start', '>=', end).orWhereNot('end', '<=', end);
          });
      }).select('table_id');

    const freeTables = await knex('tables')
      .whereNotIn('id', bookedTables.map(currentValue => currentValue.table_id))
      .orderBy('number', 'asc');
    return freeTables;
  }

  static async getFreeTablesForPeriodExceptCurrent(start, end, currentReservationId) {
    const bookedTables = await knex('reservations')
      .where(function () {
        this.where(function () {
          this.where('start', '>=', start).orWhereNot('end', '<=', start);
        })
          .orWhereNot(function () {
            this.where('start', '>=', end).orWhereNot('end', '<=', end);
          });
      })
      .andWhereNot('id', currentReservationId)
      .select('table_id');

    const freeTables = await knex('tables')
      .whereNotIn('id', bookedTables.map(currentValue => currentValue.table_id))
      .orderBy('number', 'asc');
    return freeTables;
  }
}

module.exports = ReservationsRepo;
