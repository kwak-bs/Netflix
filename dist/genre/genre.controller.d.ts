import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenreController {
    private readonly genreService;
    constructor(genreService: GenreService);
    findAll(): Promise<import("./entity/genre.entity").Genre[]>;
    findOne(id: number): Promise<import("./entity/genre.entity").Genre | null>;
    create(createGenreDto: CreateGenreDto): Promise<void>;
    update(id: number, updateGenreDto: UpdateGenreDto): Promise<import("./entity/genre.entity").Genre | null>;
    remove(id: number): Promise<number>;
}
