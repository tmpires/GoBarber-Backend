// import AppError from '@shared/errors/AppError';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListDayAvailability from './ListDayAvailability';

describe('ListMonthAvailability', () => {
  // let fakeUserRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listDayAvailabilityService: ListDayAvailability;
  beforeEach(() => {
    // fakeUserRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listDayAvailabilityService = new ListDayAvailability(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list hour availability of a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 3, 20, 14, 0, 0),
      user_id: '123123',
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 3, 20, 15, 0, 0),
      user_id: '123123',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 20, 11, 0, 0).getTime();
    });

    const availability = await listDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 4,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
