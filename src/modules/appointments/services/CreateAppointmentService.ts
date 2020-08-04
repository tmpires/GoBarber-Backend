import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    if (isBefore(date, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't create an appointment outside business hours(8am - 5pm).",
      );
    }
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }
    const checkAppointmentExists = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (checkAppointmentExists) {
      throw new AppError('Appointment already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
