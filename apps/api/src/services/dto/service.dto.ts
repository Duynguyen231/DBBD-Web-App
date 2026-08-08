import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateServiceDto {
  @ApiProperty() @IsString() titleVi: string
  @ApiProperty() @IsString() titleEn: string
  @ApiProperty() @IsString() descVi: string
  @ApiProperty() @IsString() descEn: string
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string
  @ApiPropertyOptional() @IsOptional() @IsString() image?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
