import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!value) {
            return value;
        }

        // 글자 길이가 2보다 작으면 에러 던짐
        if (value.length <= 2) {
            throw new Error("영화 제목은 3자 이상 가능합니다!");
        }

        return value;
    }

}