export interface IGenreBody {
    name: string
}

export interface IGenre extends IGenreBody {
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface IGenreParams {
    id: string
}