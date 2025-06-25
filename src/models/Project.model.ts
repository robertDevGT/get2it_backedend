import { Table, Column, Model, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";

interface IProject {
    projectName: string;
    description: string;
    manager: number;
    tasks: Task[];
}

@Table({
    tableName: 'projects'
})

class Project extends Model<IProject> {
    @Column
    declare projectName: string

    @Column
    declare description: string;


    @ForeignKey(() => User)
    @Column
    declare manager: number;

    @BelongsTo(() => User, { constraints: true })
    user: User;

    @HasMany(() => Task)
    tasks: Task[]
}

export default Project;