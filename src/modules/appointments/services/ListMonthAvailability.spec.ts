// import AppError from '@shared/errors/AppError';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListMonthAvailabilityService from './ListMonthAvailability';

describe('ListMonthAvailability', () => {
  // let fakeUserRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listMonthAvailabilityService: ListMonthAvailabilityService;
  beforeEach(() => {
    // fakeUserRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listMonthAvailabilityService = new ListMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list month availability of a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 3, 20, 8, 0, 0),
    });
    for (let i = 8; i < 18; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: '123123',
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listMonthAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
