import { Table, Column, Model, Default } from "sequelize-typescript";

export interface IUser {
    name: string;
    email: string;
    password: string;
    confirmed: boolean;
}

@Table({
    tableName: 'users'
})

class User extends Model <IUser> {
    @Column
    declare name: string;

    @Column
    declare email: string;

    @Column
    declare password: string;

    @Default(false)
    @Column
    declare confirmed: boolean;
}

export default User;