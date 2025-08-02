import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('email').notNullable().unique().index();
    table.string('name').notNullable();
    table.string('password_hash').notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.timestamps(true, true); // auto create created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
