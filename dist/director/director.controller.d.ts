import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
export declare class DirectorController {
    private readonly directorService;
    constructor(directorService: DirectorService);
    findAll(): Promise<import("./entity/director.entity").Director[]>;
    findOne(id: number): Promise<import("./entity/director.entity").Director | null>;
    create(createDirectorDto: CreateDirectorDto): Promise<CreateDirectorDto & import("./entity/director.entity").Director>;
    update(id: number, updateDirectorDto: UpdateDirectorDto): Promise<import("./entity/director.entity").Director | null>;
    remove(id: number): Promise<number>;
}
