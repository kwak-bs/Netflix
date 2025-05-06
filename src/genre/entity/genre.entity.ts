import { BaseTable } from "src/common/entity/baseTable.entity";
import { Movie } from "src/movie/entity/movie.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true // 중복되지 않도록 유니크하게.
    })
    name: string;

    @ManyToMany(
        () => Movie,
        movie => movie.id
    )
    movies: Movie[]
}
