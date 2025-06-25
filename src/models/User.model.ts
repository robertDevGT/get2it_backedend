import { Table, Column, Model, Default, HasMany, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import Project from "./Project.model";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
    projects: Project[]
}

@Table({
    tableName: 'users'
})

class User extends Model<IUser> {
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Column
    declare name: string;

    @Column
    declare email: string;

    @Column
    declare password: string;

    @Default(false)
    @Column
    declare confirmed: boolean;

    @HasMany(() => Project)
    projects: Project[]
}

export default User;