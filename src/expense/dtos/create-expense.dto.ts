import { IsNotEmpty, IsDecimal, IsUUID } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  cause: string;

  @IsDecimal()
  value: number;

  @IsUUID()
  paidBy: string;

  @IsUUID()
  paidOn: string;

  @IsUUID()
  groupId: string;

  @IsNotEmpty()
  createdAt: string;
}
