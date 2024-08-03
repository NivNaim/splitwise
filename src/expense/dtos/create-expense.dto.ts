import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  cause: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsUUID()
  paidById: string;

  @IsUUID()
  receivedById: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsUUID()
  groupId: string;

  @IsOptional()
  createdAt: string;
}
