import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  avatar: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  get_avatar_url(): string | null {
    if (!this.avatar) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 's3':
        return `https://${uploadConfig.aws.bucket}.s3.us-east-2.amazonaws.com/${this.avatar}`;
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
