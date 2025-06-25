import { Table, Column, Model, HasMany, BelongsTo, ForeignKey, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";

export interface IProject {
    id: number;
    projectName: string;
    description: string;
    managerId: number;
    tasks: Task[];
}

@Table({
    tableName: 'projects'
})

class Project extends Model<IProject> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column
    declare projectName: string

    @Column
    declare description: string;


    @ForeignKey(() => User)
    @Column
    declare managerId: number;

    @BelongsTo(() => User, { constraints: true })
    manager: User;

    @HasMany(() => Task)
    tasks: Task[]
}

export default Project;