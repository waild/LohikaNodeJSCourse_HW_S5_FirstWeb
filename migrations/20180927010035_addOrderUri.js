
exports.up = function (knex, Promise) {
  return knex.schema.alterTable('reservations', (table) => {
    table.string('orderUri', 35);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('orderUri');
  });
};
