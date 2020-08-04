import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListDayAvailability from '@modules/appointments/services/ListDayAvailability';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.body;
    const provider_id = request.params.id;

    const listProviderAvailability = container.resolve(ListDayAvailability);

    const availability = await listProviderAvailability.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(availability);
  }
}
