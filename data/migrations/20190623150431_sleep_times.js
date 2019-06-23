exports.up = function(knex) {
  return knex.schema.createTable("sleep_times", table => {
    table.increments();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("sleep_date", 128);
    table.integer("start_time", 12);
    table.integer("end_time", 12);
    table.integer("duration", 12);
    table.integer("rating", 4);
  });
};

exports.down = function(knex) {
  return knex.schema.raw("DROP TABLE IF EXISTS sleep_times");
};
