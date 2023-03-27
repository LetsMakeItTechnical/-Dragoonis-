import { Request, Response } from 'express';
import products from '../../../product.json';
import { Product } from './types';
import fs = require('fs-extra');
import path = require('path');

enum PRODUCT_SORT_BY_OPTIONS {
	A = 'a', // Title - A to Z
	B = 'b', // Title - Z to A
	C = 'c', // Highest Price
	D = 'd' // Lowest Price
}

export default class Controller {
	constructor() {}

	readCart = async () => {
		const cartData = await fs.readFile(path.resolve(__dirname, 'cart.json'), 'utf8');
		return JSON.parse(cartData);
	};

	writeCart = async (cart) => {
		await fs.writeFile(path.resolve(__dirname, 'cart.json'), JSON.stringify(cart, null, 2));
	};

	private sortProducts(products: Product[], sortBy: PRODUCT_SORT_BY_OPTIONS) {
		return products.sort((a, b) => {
			switch (sortBy) {
				case PRODUCT_SORT_BY_OPTIONS.A:
					return a.title.localeCompare(b.title);
				case PRODUCT_SORT_BY_OPTIONS.B:
					return b.title.localeCompare(a.title);
				case PRODUCT_SORT_BY_OPTIONS.C:
					return parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price);
				case PRODUCT_SORT_BY_OPTIONS.D:
					return parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price);
				default:
					return 0;
			}
		});
	}

	/**
	 * @async
	 * @function
	 * @param {Request} req - Express request object.
	 * @param {Response} res - Express response object.
	 * @returns {Promise<any>} - A promise that resolves to sending the sorted products as a JSON array.
	 * @description This method sorts an array of products based on the provided sortBy parameter.
	 * sortBy parameter values:
	 * a - Title A to Z
	 * b - Title Z to A
	 * c - Highest Price
	 * d - Lowest Price
	 */
	public getProducts = async (req: Request, res: Response): Promise<any> => {
		const { sortBy } = (req.query || {}) as { sortBy: PRODUCT_SORT_BY_OPTIONS };

		const isValidSortByOption = Object.values(PRODUCT_SORT_BY_OPTIONS).includes(sortBy);

		if (!isValidSortByOption) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const sortedProducts = this.sortProducts(products, sortBy); // Replace 'a' with the desired sorting option

		res.json(sortedProducts);
	};

	/**
	 * @async
	 * @function
	 * @param {Request} req - Express request object.
	 * @param {Response} res - Express response object.
	 * @returns {Promise<any>} - A promise that resolves to sending the updated shopping cart as a JSON object.
	 * @throws {Error} If the required productId parameter is missing.
	 * @description This method adds a product to the shopping cart based on the provided productId parameter.
	 * It updates the total items and cost of the shopping cart accordingly.
	 */
	public addCart = async (req: Request, res: Response): Promise<any> => {
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const product = products.find((product) => product.id === +productId);

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		const cart = await this.readCart();

		cart.items.push(product);

		cart.totalItems++;
		cart.totalCost += parseFloat(product.variants[0].price);

		await this.writeCart(cart);

		res.json(cart);
	};

	/**
	 * @async
	 * @function
	 * @param {Request} req - Express request object.
	 * @param {Response} res - Express response object.
	 * @returns {Promise<any>} - A promise that resolves to sending the updated shopping cart as a JSON object.
	 * @throws {Error} If the required productId parameter is missing.
	 * @description This method removes a product from the shopping cart based on the provided productId parameter.
	 * It updates the total items and cost of the shopping cart accordingly.
	 */
	public removeCart = async (req: Request, res: Response): Promise<any> => {
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const product = products.find((product) => product.id === +productId);

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		const cart = await this.readCart();

		cart.items = cart.items.filter((item) => item.id !== product.id);

		cart.totalItems--;
		cart.totalCost -= parseFloat(product.variants[0].price);

		await this.writeCart(cart);

		res.json(cart);
	};

	/**
	 * @async
	 * @function
	 * @param {Request} req - Express request object.
	 * @param {Response} res - Express response object.
	 * @returns {Promise<any>} - A promise that resolves to sending the shopping cart as a JSON object.
	 * @description This method retrieves the current shopping cart and sends it as a JSON object in the response.
	 */
	public getCart = async (req: Request, res: Response): Promise<any> => {
		const cart = await this.readCart();

		res.json(cart);
	};
}
