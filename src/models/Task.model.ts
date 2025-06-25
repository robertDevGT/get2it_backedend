import { Table, Column, Model, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import Project from "./Project.model";

@Table({
    tableName: 'tasks'
})

class Task extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column
    declare description: string

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    projectId: number;

    @BelongsTo(() => Project, { constraints: true })
    project: Project;
}

export default Task;