import supertest from 'supertest';
import products from '../../../product.json';
import app from '../../api';
import fs = require('fs-extra');
import path = require('path');
const request = supertest(app);

const clearCart = () =>
	fs.writeFile(
		path.resolve(__dirname, 'cart.json'),
		JSON.stringify(
			{
				items: [],
				totalItems: 0,
				totalCost: 0
			},
			null,
			2
		)
	);

describe('Controller', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		clearCart();
	});

	it('should get sorted products by title A-Z', async () => {
		const res = await request.get('/v1/products?sortBy=a');

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('should add a product to the cart', async () => {
		const productId = products[0].id;

		const res = await request.post(`/v1/products/${productId}/cart`);

		expect(res.status).toBe(200);

		expect(res.body.totalItems).toBe(1);

		expect(res.body.totalCost).toBe(parseFloat(products[0].variants[0].price));
	});

	it('should remove a product from the cart', async () => {
		const productId = products[0].id;
		const productId2 = products[1].id;

		await request.post(`/v1/products/${productId}/cart`);
		await request.post(`/v1/products/${productId2}/cart`);

		const res = await request.delete(`/v1/products/${productId}/cart`);

		expect(res.status).toBe(200);
		expect(res.body.totalItems).toBe(1);
		expect(res.body.totalCost).toBe(40);
	});

	it('should get the cart', async () => {
		const res = await request.get('/v1/products/cart');

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('items');
		expect(res.body).toHaveProperty('totalItems');
		expect(res.body).toHaveProperty('totalCost');
	});
});
