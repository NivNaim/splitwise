import { IsString, IsOptional, IsBoolean, IsDecimal } from 'class-validator';

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  cause?: string;

  @IsDecimal()
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  paidById?: string;

  @IsString()
  @IsOptional()
  receivedById?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}
