import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export enum JobStatus { OPEN = 'OPEN', CLOSED = 'CLOSED' }

export class CreateJobDto {
  @ApiProperty() @IsString() titleVi: string
  @ApiProperty() @IsString() titleEn: string
  @ApiProperty() @IsString() descVi: string
  @ApiProperty() @IsString() descEn: string
  @ApiProperty() @IsString() requirementsVi: string
  @ApiProperty() @IsString() requirementsEn: string
  @ApiProperty() @IsString() location: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() deadline?: string
  @ApiPropertyOptional({ enum: JobStatus }) @IsOptional() @IsEnum(JobStatus) status?: JobStatus
}
export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class JobQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() limit?: number
  @ApiPropertyOptional({ enum: JobStatus }) @IsOptional() @IsEnum(JobStatus) status?: JobStatus
}
