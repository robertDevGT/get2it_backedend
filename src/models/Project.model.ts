import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Task from "./Task.model";

@Table({
    tableName: 'projects'
})

class Project extends Model {
    @Column({
        type: DataType.STRING
    })
    projectName: string

    @Column({
        type: DataType.STRING
    })
    description: string;

    @HasMany(() => Task)
    tasks: Task[]
}

export default Project;