import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateNewsCategoryDto {
  @ApiProperty() @IsString() nameVi: string
  @ApiProperty() @IsString() nameEn: string
}
export class UpdateNewsCategoryDto extends PartialType(CreateNewsCategoryDto) {}

export class CreateNewsDto {
  @ApiProperty() @IsString() titleVi: string
  @ApiProperty() @IsString() titleEn: string
  @ApiProperty() @IsString() excerptVi: string
  @ApiProperty() @IsString() excerptEn: string
  @ApiProperty() @IsString() contentVi: string
  @ApiProperty() @IsString() contentEn: string
  @ApiPropertyOptional() @IsOptional() @IsString() thumbnail?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) categoryId?: number
}
export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export class NewsQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() limit?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() categoryId?: number
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string
}
