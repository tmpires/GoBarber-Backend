import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    if (except_id) {
      users = this.users.filter(user => user.id !== except_id);
    }
    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(u => u.email === email);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(u => u.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUsersDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), email, name, password });
    this.users.push(user);
    return user;
  }
}

export default FakeUsersRepository;
