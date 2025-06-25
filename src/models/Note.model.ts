import { Table, Column, Model, BelongsTo, ForeignKey, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";

export interface INote {
    id: number;
    description: string;
    userId: number;
    taskId: number;
}

@Table({
    tableName: 'notes'
})

class Note extends Model<INote> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column({
        allowNull: false
    })
    declare description: string;

    @ForeignKey(() => Task)
    @Column
    declare taskId: number;

    @ForeignKey(() => User)
    @Column
    declare userId: number;

    @BelongsTo(() => User, { constraints: true })
    user: User;

    @BelongsTo(() => Task, { constraints: true })
    task: Task;
}

export default Note;