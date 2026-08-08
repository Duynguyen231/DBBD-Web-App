import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateBannerDto {
  @ApiProperty() @IsString() image: string
  @ApiPropertyOptional() @IsOptional() @IsString() titleVi?: string
  @ApiPropertyOptional() @IsOptional() @IsString() titleEn?: string
  @ApiPropertyOptional() @IsOptional() @IsString() link?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
  @ApiPropertyOptional() @IsOptional() @IsString() page?: string
}
export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
