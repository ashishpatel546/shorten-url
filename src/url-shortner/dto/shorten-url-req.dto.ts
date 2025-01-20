import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl({}, { message: 'URL must be valid url' })
  @IsNotEmpty({ message: 'original_url can not be empty' })
  original_url: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message:
        'expires_in must be a number or you can remove it. It will take default value 48 hours',
    },
  )
  @Transform(({ value }) => Number(value))
  expires_in: number;
}
