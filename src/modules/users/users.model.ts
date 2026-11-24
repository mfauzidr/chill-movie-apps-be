export interface IUserBody {
    username?: string;
    email: string;
    password: string;
    role?: string;
    image?:  string;
    is_active?: boolean;
}

export interface IUser extends IUserBody {
    id: number;
    uuid: string;
    created_at: Date;
    updated_at: Date;
}

export interface IUserParams {
    uuid: string
}