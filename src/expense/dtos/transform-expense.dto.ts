import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Group } from 'src/group/group.schema';

export class TransformedExpenseDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  cause: string;

  @IsDecimal()
  value: number;

  @IsUUID()
  paidById: string;

  @IsUUID()
  receivedById: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsNotEmpty()
  group: Group;

  @IsOptional()
  createdAt?: string;
}
