import { getRepository, Repository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { id },
    });

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async save(user: User): Promise<User> {
    const updatedUser = await this.ormRepository.save(user);
    return updatedUser;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUsersDTO): Promise<User> {
    const appointment = this.ormRepository.create({ email, name, password });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default UsersRepository;
