import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.schema';
import { Group } from 'src/group/group.schema';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cause: string;

  @Column('decimal')
  value: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @Exclude({ toPlainOnly: true })
  paidBy: User;

  @ManyToOne(() => User, (user) => user.incomes)
  @Exclude({ toPlainOnly: true })
  paidOn: User;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @Column({ default: new Date().getUTCDate().toString() })
  createdAt: string;
}
