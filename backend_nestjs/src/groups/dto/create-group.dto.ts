import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  @IsNotEmpty()
  time: Date;

  @IsNumber()
  @IsOptional()
  maxUsers?: number;
}
