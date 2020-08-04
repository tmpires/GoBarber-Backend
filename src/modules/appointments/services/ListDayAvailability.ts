import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
// import User from '@modules/users/infra/typeorm/entities/User';
// import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListMonthAvailabilityService {
  constructor(
    // @inject('UsersRepository')
    // private usersRepository: IUsersRepository,
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, month, year, day },
    );
    const hourStart = 8;

    const hoursArray = Array.from(
      {
        length: 10,
      },
      (value, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());
    const availability = hoursArray.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );
      const filterDate = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointment && isAfter(filterDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListMonthAvailabilityService;
