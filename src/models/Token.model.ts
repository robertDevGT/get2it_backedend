import { Table, Column, Model, DataType, BelongsTo, ForeignKey, Default } from "sequelize-typescript";
import User from "./User.model";

interface IToken {
    token: string;
    expiresAt: Date;
    userId: number;
}

@Table({
    tableName: 'tokens'
})

class Token extends Model<IToken> {
    @Column
    declare token: string;

    @Default(DataType.NOW)
    @Column
    declare expiresAt: Date;

    @ForeignKey(() => User)
    @Column
    declare userId: number;

    @BelongsTo(() => User, { constraints: true })
    user: User;
}

export default Token;