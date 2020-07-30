import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfile', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateUserService: UpdateProfileService;
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      name: 'Tony Pires',
      email: 'tmendespires@gmail.com',
    });

    await expect(updatedUser.name).toBe('Tony Pires');
  });
  it('should not be able to change email for an used one', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await fakeUserRepository.create({
      name: 'Antonio Pires',
      email: 'tmendespires@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'Tony Pires',
        email: 'tmendespires@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update user password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      name: 'Tony Pires',
      email: 'tmendespires@gmail.com',
      password: '654321',
      old_password: '123456',
    });

    await expect(updatedUser.password).toBe('654321');
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'Tony Pires',
        email: 'tmendespires@gmail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'Tony Pires',
        email: 'tmendespires@gmail.com',
        password: '654321',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update user profile from non-existing user', async () => {
    await expect(
      updateUserService.execute({
        user_id: 'non-existing-user',
        email: 'johndoe@gmail.com',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
