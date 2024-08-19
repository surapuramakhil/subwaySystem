import express from 'express';
import { TrainLineController } from '../controllers/TrainLineController';
import { CardController } from '../controllers/CardController';
import { RideController } from '../controllers/RideController';

const router = express.Router();
const trainLineController = new TrainLineController();
const cardController = new CardController();
const rideController = new RideController();

router.post('/train-line/', trainLineController.addTrainLine.bind(trainLineController));
router.get('/route', trainLineController.getOptimalRoute.bind(trainLineController));

router.post('/card', cardController.createOrUpdateCard.bind(cardController));

router.post('/station/:station/enter', rideController.startRide.bind(rideController));
router.post('/station/:station/exit', rideController.endRide.bind(rideController));

export default router;