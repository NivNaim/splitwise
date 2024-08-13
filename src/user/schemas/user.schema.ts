import { RefreshToken } from 'src/auth/refresh-token.schema';
import { Expense } from 'src/expense/expense.schema';
import { Group } from 'src/group/group.schema';
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

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Group, (group) => group.owner)
  ownedGroups: Group[];

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable({
    name: 'user_groups_members',
  })
  memberOfGroups: Group[];

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  expenses: Expense[];

  @OneToMany(() => Expense, (expense) => expense.paidOn)
  incomes: Expense[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
