import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListMonthAvailability from '@modules/appointments/services/ListMonthAvailability';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.body;
    const provider_id = request.params.id;

    const listProviderAvailability = container.resolve(ListMonthAvailability);

    const availability = await listProviderAvailability.execute({
      provider_id,
      year,
      month,
    });

    return response.json(availability);
  }
}
