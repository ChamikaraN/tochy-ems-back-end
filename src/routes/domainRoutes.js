import express from 'express';
import { createDomain, deleteDomain, getDomain, updateDomain } from '../controllers/domainController.js';
const router = express.Router();
import {protect} from '../middleware/authMiddleware.js'


// Domain route
router.route('/').get(protect, getDomain)
router.route('/add').post(protect, createDomain)
router.route('/delete/:id').delete( deleteDomain)
router.route('/update/:id').put( updateDomain)





export default router