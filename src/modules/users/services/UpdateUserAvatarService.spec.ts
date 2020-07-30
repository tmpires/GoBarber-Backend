import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserService: UpdateUserAvatarService;
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update user avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      avatarFilename: 'hewwooo.senpai',
    });

    await expect(updatedUser).toHaveProperty('id');
    await expect(updatedUser.avatar).toEqual('hewwooo.senpai');
  });
  it('should not be able to update user avatar of non-existing user', async () => {
    await expect(
      updateUserService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'hewwooo.senpai',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should delete old avatar after new upload', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await updateUserService.execute({
      user_id: user.id,
      avatarFilename: 'hewwo.senpai',
    });

    await updateUserService.execute({
      user_id: user.id,
      avatarFilename: 'ok.senpai',
    });
    await expect(deleteFile).toHaveBeenCalledWith('hewwo.senpai');

    await expect(user.avatar).toBe('ok.senpai');
  });
});
