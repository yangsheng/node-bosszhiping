import express from 'express';
import OfferControllers from '../controllers/offer';
const router = express.Router();


router.get('/getOffer',OfferControllers.getOffer);

router.get('/getOfferList',OfferControllers.getOfferList);

router.get('/getNationalStatistics',OfferControllers.getNationalStatistics);


router.get('/getIndustryStatistics',OfferControllers.getIndustryStatistics);

export default router;