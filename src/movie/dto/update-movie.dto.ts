import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ArrayNotEmpty, Equals, IsArray, IsBoolean, IsDefined, IsEmpty, IsHexColor, IsIn, IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString, NotContains, NotEquals, registerDecorator, Validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) { }


// export class UpdateMovieDto {
//     @IsNotEmpty() // 필드가 있을때 값이 비어있으면 안됨
//     @IsOptional() // 해당 title 필드 자체가 없어도됨.
//     @IsString()
//     title?: string;

//     @IsArray()
//     @ArrayNotEmpty()
//     @IsNumber({}, {
//         each: true
//     })
//     @IsOptional()
//     genreIds?: number[];

//     @IsNotEmpty()
//     @IsOptional()
//     @IsString()
//     detail?: string;

//     @IsNotEmpty()
//     @IsOptional()
//     @IsNumber()
//     directorId?: number;
// }


// @ValidatorConstraint({
//     async: true, // 비동기 가능
// })
// class PasswordValidator implements ValidatorConstraintInterface {
//     validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
//         // 비밀번호 길이는 4-8

//         return value.length > 4 && value.length < 8;
//     }
//     defaultMessage?(validationArguments?: ValidationArguments): string {
//         throw '비밀번호의 길이는 4~8자 여야합니다. 입력된 비밀번호 : ($value)';
//     }
// }

// function IsPasswordValid(validationOptions?: ValidationOptions) {
//     return function (object: Object, propertyName: string) {
//         registerDecorator({
//             target: object.constructor,
//             propertyName,
//             options: validationOptions,
//             validator: PasswordValidator,
//         });
//     }
// }
