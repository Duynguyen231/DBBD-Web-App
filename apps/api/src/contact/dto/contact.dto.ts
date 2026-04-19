import { IsString, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateContactDto {
  @ApiProperty() @IsString() name: string
  @ApiProperty() @IsEmail() email: string
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string
  @ApiProperty() @IsString() subject: string
  @ApiProperty() @IsString() message: string
}
