import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) { }

// export class UpdateGenreDto {
//     @IsNotEmpty()
//     @IsOptional()
//     @IsString()
//     name?: string;
// }
