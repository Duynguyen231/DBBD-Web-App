import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreatePartnerDto {
  @ApiProperty() @IsString() name: string
  @ApiProperty() @IsString() logo: string
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Type(() => Number) order?: number
}
export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}
