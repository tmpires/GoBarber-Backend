import { getRepository, Repository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({
    except_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];
    if (except_id) {
      users = await this.ormRepository.find({ where: { id: Not(except_id) } });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
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
