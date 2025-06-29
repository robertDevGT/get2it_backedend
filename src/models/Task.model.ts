import { Table, Column, Model, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, DataType, HasMany } from "sequelize-typescript";
import Project from "./Project.model";
import Note from "./Note.model";
import User from "./User.model";

export interface ITask {
    id: number;
    description: string;
    status: string;
    projectId: number;
    assigneeId: number;
    notes: Note[];
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

class Task extends Model<ITask> {
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

    @ForeignKey(() => User)
    @Column({
        allowNull: true
    })
    declare assigneeId: number;

    @BelongsTo(() => User, { as: 'assignee', constraints: true })
    assignee: User;

    @BelongsTo(() => Project, { as: 'project', constraints: true })
    project: Project;

    @HasMany(() => Note, { as: 'notes', constraints: true, onDelete: 'CASCADE' })
    notes: Note[]
}

export default Task;