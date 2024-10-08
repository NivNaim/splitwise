import { Exclude } from 'class-transformer';
import { User } from 'src/user/schemas/user.schema';
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

  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  @Exclude({ toPlainOnly: true })
  paidBy: User;

  @ManyToOne(() => User, (user) => user.incomes, { onDelete: 'CASCADE' })
  @Exclude({ toPlainOnly: true })
  paidOn: User;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
  group: Group;

  @Column({ default: new Date().getUTCDate().toString() })
  createdAt: string;
}
