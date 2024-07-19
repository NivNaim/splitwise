import { User } from 'src/auth/user.entity';
import { Expense } from 'src/expense/expense.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany((_type) => User, (user) => user.memberOfGroups)
  members: User[];

  @ManyToOne((_type) => User, (user) => user.ownedGroups)
  owner: User;

  @OneToMany((_type) => Expense, (expense) => expense.group)
  expenses: Expense[];
}
