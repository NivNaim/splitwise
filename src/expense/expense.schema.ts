import { User } from 'src/auth/schemas/user.schema';
import { Group } from 'src/group/group.schema';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal')
  value: number;

  @ManyToOne(() => User, (user) => user.expenses)
  paidBy: User;

  @ManyToOne(() => User, (user) => user.incomes)
  receivedBy: User;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @Column()
  createdAt: string;
}
