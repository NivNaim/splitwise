import { group } from 'console';
import { User } from 'src/auth/user.entity';
import { Group } from 'src/group/group.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal')
  value: number;

  @ManyToOne((_type) => User)
  paidBy: User;

  @ManyToOne((_type) => User)
  paidOn: User;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne((_type) => Group, (group) => group.expenses)
  group: Group;

  @Column()
  createdAt: string;
}
