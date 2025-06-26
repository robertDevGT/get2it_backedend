import { Table, Column, Model, Default, HasMany, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import Project from "./Project.model";
import Task from "./Task.model";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
    profileImg: string;
    projects: Project[];
    tasks: Task[];
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

    @Column
    declare profileImg: string;

    @Default(false)
    @Column
    declare confirmed: boolean;

    @HasMany(() => Project)
    projects: Project[]

    @HasMany(() => Task)
    tasks: Task[]
}

export default User;