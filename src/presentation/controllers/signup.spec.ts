import { IEmailValidator } from "./../protocols/Iemail-validator";
import { InvalidParamError } from "../erros/Invalid-params-erros copy";
import { MissingParamErro } from "./../erros/Missing-params-erros";
import { SignUpController } from "./SignUpController";

interface ISutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
}

const makeSut = (): ISutTypes => {
  class EmailValidadtorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidadtorStub();
  const sut = new SignUpController(emailValidatorStub);

  return { sut, emailValidatorStub };
};
describe("SignUp controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        confirmPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamErro("name"));
  });

  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamErro("email"));
  });
  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        confirmPassword: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamErro("password"));
  });
});

test("Should return 400 if no confirmePassword is provided", () => {
  const { sut } = makeSut();
  const httpRequest = {
    body: {
      name: "any_name",
      email: "invalid-email_email",
      password: "any_password",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new MissingParamErro("confirmPassword"));
});

test("Should return 400 if an invalid email is provided", () => {
  const { sut, emailValidatorStub } = makeSut();
  jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
  const httpRequest = {
    body: {
      name: "any_name",
      email: "any_email",
      password: "any_password",
      confirmPassword: "any_password",
    },
  };
  const httpResponse = sut.handle(httpRequest);
  expect(httpResponse.statusCode).toBe(400);
  expect(httpResponse.body).toEqual(new InvalidParamError("email"));
});
