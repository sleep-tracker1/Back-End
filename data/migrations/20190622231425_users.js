exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .string("username", 32)
      .unique()
      .notNullable();
    table.string("password", 32).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.raw("DROP TABLE IF EXISTS users");
};
