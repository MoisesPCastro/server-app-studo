import { badRequest } from "./../helpers/http-helpes";
import { MissingParamErro } from "./../erros/Missing-params-erros";
import { IHttpReponse, IHttpRequest } from "../protocols/http";
import { ISignUpController } from "../protocols/IControllers";
import { IEmailValidator } from "../protocols/Iemail-validator";
import { InvalidParamError } from "../erros/Invalid-params-erros copy";

export class SignUpController implements ISignUpController {
  constructor(private readonly emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: IHttpRequest): IHttpReponse {
    const mandatoryParameters = [
      "name",
      "email",
      "password",
      "confirmPassword",
    ];

    for (const params of mandatoryParameters) {
      if (!httpRequest.body[params])
        return badRequest(new MissingParamErro(params));
    }

    if (!this.emailValidator.isValid(httpRequest.body.email))
      return badRequest(new InvalidParamError("email"));
  }
}
