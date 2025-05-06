import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    detail: string;

    @IsNumber()
    @IsNotEmpty()
    directorId: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, {
        each: true, // 리스트 안의 모든 값들이 검증됨. 즉 전부 넘버여야함.
    })
    genreIds: number[];
}
