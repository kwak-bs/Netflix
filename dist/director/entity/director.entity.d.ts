import { BaseTable } from "src/common/entity/baseTable.entity";
import { Movie } from "src/movie/entity/movie.entity";
export declare class Director extends BaseTable {
    id: number;
    name: string;
    dob: Date;
    nationality: string;
    movies: Movie[];
}
