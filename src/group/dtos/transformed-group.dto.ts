import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class TransformedGroupDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  ownerId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  membersIds: string[];
}
