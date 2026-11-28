export interface IMyListParams {
  userUuid: string;
  contentUuid?: string;
}

export interface IMyListCreateBody {
  content_uuid: string;
}

export interface IMyListContent {
  uuid: string;
  title: string;
  poster: string;
  banner: string;
  content_type: "movie" | "series";
}

export interface IMyList {
  id: number;
  user_uuid: string;
  content_uuid: string;
  created_at: Date;
  content: IMyListContent;
}
