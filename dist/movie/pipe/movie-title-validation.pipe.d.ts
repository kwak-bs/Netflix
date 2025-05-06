import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class MovieTitleValidationPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
