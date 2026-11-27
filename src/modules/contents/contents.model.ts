export type ContentType = "movie" | "series";

export interface IContentCreateBody {
  title: string;
  release_date: string;
  synopsis: string;
  age_rating: string;
  poster: string;
  banner: string;
  content_type: ContentType;
  is_premium?: boolean;
  is_active?: boolean;
  genre_ids?: number[];
  cast_ids?: number[];
  producer_ids?: number[];
}

export type IContentUpdateBody = Partial<
  Pick<
    IContentCreateBody,
    | "title"
    | "release_date"
    | "synopsis"
    | "age_rating"
    | "poster"
    | "banner"
    | "content_type"
    | "is_premium"
  >
>;

export interface IContentRelation {
  id: number;
  name: string;
}

export interface IContent {
  id: number;
  uuid: string;
  title: string;
  release_date: string;
  synopsis: string;
  age_rating: string;
  poster: string;
  banner: string;
  content_type: ContentType;
  is_premium: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
  genres: IContentRelation[];
  casts: IContentRelation[];
  producers: IContentRelation[];
}

export interface IContentParams {
  uuid: string;
}
