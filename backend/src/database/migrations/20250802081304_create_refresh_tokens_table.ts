import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('refresh_tokens', table => {
    table.string('jti').primary(); // unique token id
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('expires_at').notNullable();
    table.boolean('is_revoked').defaultTo(false);
    table.text('user_agent_info'); // record login info (computer type, location, etc.)
    table.string('replace_by'); // replace new token jti
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // foreign key constraint
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // index
    table.index(['user_id']);
    table.index(['expires_at']);
    table.index(['is_revoked']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('refresh_tokens');
}
