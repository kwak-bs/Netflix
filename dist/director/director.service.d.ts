import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entity/director.entity';
import { Repository } from 'typeorm';
export declare class DirectorService {
    private readonly directorRepository;
    constructor(directorRepository: Repository<Director>);
    create(createDirectorDto: CreateDirectorDto): Promise<CreateDirectorDto & Director>;
    findAll(): Promise<Director[]>;
    findOne(id: number): Promise<Director | null>;
    update(id: number, updateDirectorDto: UpdateDirectorDto): Promise<Director | null>;
    remove(id: number): Promise<number>;
}
