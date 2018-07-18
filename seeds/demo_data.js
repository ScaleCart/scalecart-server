
exports.seed = function(knex, Promise) {
  return knex('product').del()
    .then(function () {
      return knex('product').insert([
        {id: 1, name: {en: 'Product A', pt: 'Produto A' }, sku: 'A', price: '12.34', images: JSON.stringify([
          { url: 'image_A_1.png' },
          { url: 'image_A_2.png' },
        ])},
        {id: 2, name: {en: 'Product B', pt: 'Produto B' }, sku: 'B', price: '1.23'},
        {id: 3, name: {en: 'Product C', pt: 'Produto C' }, sku: 'C', price: '0.12'},
        {id: 4, name: {en: 'Product D', pt: 'Produto D' }, sku: 'D', price: '123.40'},
      ]);
    });
};
