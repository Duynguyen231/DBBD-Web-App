import { IsString, IsOptional, IsArray } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class CreateProductDto {
  @ApiProperty() @IsString() titleVi: string
  @ApiProperty() @IsString() titleEn: string
  @ApiProperty() @IsString() descVi: string
  @ApiProperty() @IsString() descEn: string
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() images?: string[]
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() limit?: number
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string
}
