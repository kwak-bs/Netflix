import { Exclude } from "class-transformer";
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseTable {
    @CreateDateColumn()
    @Exclude() // 리턴값에 노출 안시킬수있음 (제외하다) => Serialization
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;

    @VersionColumn()
    @Exclude()
    version: number;
}