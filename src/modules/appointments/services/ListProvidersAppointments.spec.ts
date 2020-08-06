// import AppError from '@shared/errors/AppError';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersAppointments from './ListProvidersAppointments';

describe('ListMonthAvailability', () => {
  // let fakeUserRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listProvidersAppointments: ListProvidersAppointments;
  let fakeCacheProvider: FakeCacheProvider;
  beforeEach(() => {
    // fakeUserRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersAppointments = new ListProvidersAppointments(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list daily appointments of a provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    const appointments = await listProvidersAppointments.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
