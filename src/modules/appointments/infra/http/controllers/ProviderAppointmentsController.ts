import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersAppointments from '@modules/appointments/services/ListProvidersAppointments';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.body;
    const provider_id = request.user.id;

    const listProvidersAppointments = container.resolve(
      ListProvidersAppointments,
    );

    const appointments = await listProvidersAppointments.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(appointments);
  }
}
