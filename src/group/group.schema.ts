import { Exclude } from 'class-transformer';
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

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.memberOfGroups, {
    cascade: true,
    eager: false,
  })
  @Exclude({ toPlainOnly: true })
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups, { onDelete: 'CASCADE' })
  @Exclude({ toPlainOnly: true })
  owner: User;

  @OneToMany(() => Expense, (expense) => expense.group, {
    cascade: ['insert', 'update', 'remove'],
  })
  expenses: Expense[];
}
