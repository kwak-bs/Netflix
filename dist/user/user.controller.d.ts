import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & import("./entity/user.entity").User>;
    findAll(): Promise<import("./entity/user.entity").User[]>;
    findOne(id: number): Promise<import("./entity/user.entity").User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("./entity/user.entity").User | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
