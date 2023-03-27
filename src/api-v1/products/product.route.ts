import { Router } from 'express';
import Controller from './product.controller';

const products: Router = Router();
const controller = new Controller();

products.get('/', controller.getProducts);

products
	.post('/:productId/cart', controller.addCart)
	.delete('/:productId/cart', controller.removeCart);

products.get('/cart', controller.getCart);

export default products;
