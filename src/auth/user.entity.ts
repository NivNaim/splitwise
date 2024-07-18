import { Expense } from 'src/expense/expense.entity';
import { Group } from 'src/group/group.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany((_type) => Group, (group) => group.owner)
  ownedGroups: Group[];

  @ManyToMany((_type) => Group, (group) => group.members)
  @JoinTable({
    name: "user_groups"
  })
  memberGroups: Group[];

  @OneToMany((_type) => Expense, (expense) => expense.paidBy)
  expenses: Expense[];

  @OneToMany((_type) => Expense, (expense) => expense.paidBy)
  incomes: Expense[];
}
