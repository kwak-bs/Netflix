import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateDirectorDto } from "./create-director.dto";

export class UpdateDirectorDto extends PartialType(CreateDirectorDto) { }

// export class UpdateDirectorDto {
//     @IsOptional()
//     @IsString()
//     @IsNotEmpty()
//     name?: string;

//     @IsOptional()
//     @IsDateString()
//     @IsNotEmpty()
//     dob?: Date;

//     @IsOptional()
//     @IsString()
//     @IsNotEmpty()
//     nationality?: string;
// }
