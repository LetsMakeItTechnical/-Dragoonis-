import { Router } from 'express';

import products from './products/product.route';

const router: Router = Router();

router.use('/products', products);

export default router;
