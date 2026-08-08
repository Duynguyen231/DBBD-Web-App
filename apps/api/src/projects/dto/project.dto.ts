import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export enum ProjectStatus { ONGOING = 'ONGOING', COMPLETED = 'COMPLETED', UPCOMING = 'UPCOMING' }

export class CreateProjectDto {
  @ApiProperty() @IsString() titleVi: string
  @ApiProperty() @IsString() titleEn: string
  @ApiProperty() @IsString() descVi: string
  @ApiProperty() @IsString() descEn: string
  @ApiProperty() @IsString() location: string
  @ApiPropertyOptional({ enum: ProjectStatus }) @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() images?: string[]
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string
}
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() limit?: number
  @ApiPropertyOptional({ enum: ProjectStatus }) @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string
}
