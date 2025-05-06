import { BaseTable } from "src/common/entity/baseTable.entity";
import { Movie } from "src/movie/entity/movie.entity";
export declare class Genre extends BaseTable {
    id: number;
    name: string;
    movies: Movie[];
}
