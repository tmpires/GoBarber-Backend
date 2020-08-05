import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providersMonthController = new ProviderMonthAvailabilityController();
const providersDayController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:id/month-availability',
  celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
  providersMonthController.index,
);
providersRouter.get(
  '/:id/day-availability',
  celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
  providersDayController.index,
);

export default providersRouter;
