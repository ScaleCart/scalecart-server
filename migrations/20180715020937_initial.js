
exports.up = async function(knex) {
  await knex.schema.createTable('customer', (table) => {
    table.bigIncrements();
    table.timestamps();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
  });

  await knex.schema.createTable('product', (table) => {
    table.bigIncrements();
    table.timestamps();
    table.jsonb('name').notNullable().defaultsTo('{}');
    table.string('sku').notNullable();
    table.jsonb('description').notNullable().defaultsTo('{}');
    table.integer('stock').notNullable().defaultsTo(0);
    table.decimal('price', 19, 4);
    table.decimal('discount_price', 19, 4);
    table.jsonb('images').notNullable().defaultsTo('[]');
  });

  await knex.schema.createTable('cart', (table) => {
    table.bigIncrements();
    table.timestamps();
    table.bigInteger('customer_id').notNullable().references('customer.id');
  });

  await knex.schema.createTable('cart_item', (table) => {
    table.bigInteger('cart_id').notNullable().references('cart.id');
    table.bigInteger('product_id').notNullable().references('product.id');
    table.integer('quantity').notNullable();
    table.primary(['cart_id', 'product_id']);
  });
  await knex.raw(`ALTER TABLE "cart_item"
    ADD CONSTRAINT check_quantity CHECK (quantity >= 0);`)
};

exports.down = async function(knex) {
  await knex.schema.dropTable('cart_item');
  await knex.schema.dropTable('cart');
  await knex.schema.dropTable('product');
  await knex.schema.dropTable('customer');
};
