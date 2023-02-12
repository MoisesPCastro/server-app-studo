import { IHttpReponse, IHttpRequest } from "./http";

export interface ISignUpController {
  handle(httpRequest: IHttpRequest): IHttpReponse;
}
