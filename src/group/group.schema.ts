import { User } from 'src/auth/schemas/user.schema';
import { Expense } from 'src/expense/expense.schema';
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

  @ManyToMany(() => User, (user) => user.memberOfGroups)
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups)
  owner: User;

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];
}
