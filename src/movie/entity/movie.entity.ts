import { Exclude, Expose, Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";
import { BaseTable } from "../../common/entity/baseTable.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "src/director/entity/director.entity";
import { Genre } from "src/genre/entity/genre.entity";


// ManyToOne Director -> 감독은 여러개의 영화를 만들수 있음.
// OneToOne MovieDetail -> 영화는 하나의 상세 내용을 갖을 수 있음. 
// ManyToMany Genre -> 영화는 여러개의 장르를 갖을 수 있고, 장르는 여러개의 영화에 속할 수 있음. 




// @Exclude()
@Entity()
export class Movie extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    title: string;

    @ManyToMany(
        () => Genre,
        genre => genre.movies
    )
    @JoinTable() // ManyToMany는 주도권이 어디에 있뜬 상관이 없다. 그래서 걍 Movie에 넣음.
    genres: Genre[];

    @OneToOne(
        () => MovieDetail,
        movieDetail => movieDetail.id,
        {
            cascade: true, // 데이터를 create할 때 한번에 생성되게끔 해주는 옵션임
            nullable: false, // DB에서 강제로 null UPDATE 해도 오류를 발생하게끔 해주는 옵션임
        }
    )
    // 조금 더 메인이 되는 쪽에 해당 어노테이션을 넣어주면됨. 
    // 즉, 무비 테이블에 detailId를 넣고 싶으면 이 어노테이션 넣어주면되는거임임
    @JoinColumn()
    detail: MovieDetail;

    @ManyToOne(
        () => Director,
        director => director.id,
        {
            cascade: true,
            nullable: false
        }
    )
    director: Director;

    // @Expose() // 노출하다 
    // => 클래스 자체를 Exclude하고 부분적으로 보여주고 싶은것들만 expose할때 사용
    // @Exclude() // 빼다, 제외하다

    // 커스텀 트랜스포머
    // @Transform(
    //     ({ value }) => value.toString().toUpperCase(),
    // )

    // @Expose() // 이런 경우에도 expose씀. 
    // // 일반적으로는 프로퍼티(필드)만 노출되는데 get함수도 노출가능해짐짐
    // get description() {
    //     return `id: ${this.id} title: ${this.title}`;
    // }

    // @Column(
    //     () => BaseEntity,
    // )
    // base: BaseEntity    => 이렇게 하면 근데 db 칼럼명이 baseCreateAt, baseUpdatedAt 이런 식으로 나옴. 별로임 그냥 extends가 나음 
}

// 어떤 형태로 데이터를 다룰지를 정하는 곳 entity