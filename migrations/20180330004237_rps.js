
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rps', function (t) {
    t.increments('id').primary();
    t.integer('user_id').notNullable().index().references('user.id');
    t.string('email_id');
    t.string('rpname').notNullable();
    t.string('rplocation').notNullable();
    t.text('rpdata').collate('utf8mb4_unicode_ci').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  }) 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('rps');
};
