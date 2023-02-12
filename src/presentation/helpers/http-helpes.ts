import { IHttpReponse } from "./../protocols/http";

export const badRequest = (error: Error): IHttpReponse => ({
  statusCode: 400,
  body: error,
});
