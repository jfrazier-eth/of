export interface InitResponse {
  csrf: string;
  sess: string;
}

export interface GetInitResponseBody {
  csrf: string;
}
