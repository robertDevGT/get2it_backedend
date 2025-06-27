import { Table, Model, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from "sequelize-typescript";
import Project from "./Project.model";
import User from "./User.model";

export interface IProjectUser {
    id: number;
    projectId: number;
    userId: number;
    role: number;
}

@Table({
    tableName: 'projectUsers'
})

class ProjectUser extends Model<IProjectUser> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @ForeignKey(() => Project)
    @Column({
        allowNull: false
    })
    declare projectId: number;

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    declare userId: number;

    @Column
    declare role: number;

    @BelongsTo(() => User, { as: 'member', constraints: true })
    user: User;

    @BelongsTo(() => Project, { as: 'project', constraints: true })
    project: Project;

}

export default ProjectUser;