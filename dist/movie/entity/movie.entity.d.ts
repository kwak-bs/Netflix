import { BaseTable } from "../../common/entity/baseTable.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "src/director/entity/director.entity";
import { Genre } from "src/genre/entity/genre.entity";
export declare class Movie extends BaseTable {
    id: number;
    title: string;
    genres: Genre[];
    detail: MovieDetail;
    director: Director;
}
