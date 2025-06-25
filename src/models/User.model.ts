import { Table, Column, Model, Default, ForeignKey, HasMany } from "sequelize-typescript";
import Project from "./Project.model";

export interface IUser {
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