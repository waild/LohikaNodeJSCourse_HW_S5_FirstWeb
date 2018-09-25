
exports.seed = function (knex, Promise) {
  return knex('reservations').truncate()
    .then(() => knex('reservations').insert([
      {
        table_id: 1, start: new Date('2016-09-08 15:00:00.00000-06'), end: new Date('2016-09-08 16:00:00.00000-06'), guests: 2,
      },
    ]));
};
