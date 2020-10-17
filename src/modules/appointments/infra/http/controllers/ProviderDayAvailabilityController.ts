import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListDayAvailability from '@modules/appointments/services/ListDayAvailability';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.query;
    const provider_id = request.params.id;

    const listProviderAvailability = container.resolve(ListDayAvailability);

    const availability = await listProviderAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return response.json(availability);
  }
}
