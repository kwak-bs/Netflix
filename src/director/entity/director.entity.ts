import { BaseTable } from "src/common/entity/baseTable.entity";
import { Movie } from "src/movie/entity/movie.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Director extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @Column()
    dob: Date;

    @Column()
    nationality: string;

    @OneToMany( // 감독이 한명이고 Movie가 여러개니까 OneToMany임 항상 현재 테이블 기준으로 생각하자
        () => Movie,
        movie => movie.director,
    )
    movies: Movie[];
}
