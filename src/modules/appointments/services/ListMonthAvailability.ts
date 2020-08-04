import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
// import User from '@modules/users/infra/typeorm/entities/User';
// import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
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
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year },
    );
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const daysInMonthArray = Array.from(
      {
        length: daysInMonth,
      },
      (value, index) => index + 1,
    );

    const availability = daysInMonthArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );
      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListMonthAvailabilityService;
