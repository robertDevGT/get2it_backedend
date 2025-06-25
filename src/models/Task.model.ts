import { Table, Column, Model, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Default, DataType } from "sequelize-typescript";
import Project from "./Project.model";

interface ITask {
    id: number;
    description: string;
    status: string;
    projectId: number;
}

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'InProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const


@Table({
    tableName: 'tasks'
})

class Task extends Model<ITask>{
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column
    declare description: string

    @Column({
        type: DataType.ENUM(...Object.values(taskStatus)),
        allowNull: false,
        defaultValue: taskStatus.PENDING
    })
    declare status: string;

    @ForeignKey(() => Project)
    @Column({
        allowNull: false
    })
    declare projectId: number;

    @BelongsTo(() => Project, { as: 'project', constraints: true } )
    project: Project;
}

export default Task;