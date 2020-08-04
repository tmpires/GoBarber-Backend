// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUserRepository: FakeUsersRepository;
  let listProvidersService: ListProvidersService;
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUserRepository);
  });
  it('should be able to list providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Tony Doe',
      email: 'tonydoe@gmail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
