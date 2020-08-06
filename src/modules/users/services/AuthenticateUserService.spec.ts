import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvicer: FakeHashProvider;
  let authenticateUserService: AuthenticateUserService;
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvicer = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvicer,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with wrong error', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'johndoe@gmail.com',
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate a non-existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
