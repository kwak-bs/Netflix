import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entity/genre.entity';
import { Repository } from 'typeorm';
export declare class GenreService {
    private readonly genreRepository;
    constructor(genreRepository: Repository<Genre>);
    findAll(): Promise<Genre[]>;
    findOne(id: number): Promise<Genre | null>;
    create(createGenreDto: CreateGenreDto): Promise<void>;
    update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre | null>;
    remove(id: number): Promise<number>;
}
