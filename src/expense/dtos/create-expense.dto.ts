import {
  IsNotEmpty,
  IsDecimal,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  cause: string;

  @IsDecimal()
  value: number;

  @IsUUID()
  paidById: string;

  @IsUUID()
  paidOnId: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsUUID()
  groupId: string;

  @IsOptional()
  createdAt: string;
}
