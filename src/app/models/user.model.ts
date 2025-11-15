import { UserPayload } from "../interfaces/user-payload.interface";

export class User {

  /**
   * Creates an instance of User.
   * @memberof User
   */
  constructor(
    private email:string , 
    private plainPassword:string, 
    private confirmationPassword:string, 
    private firstName:string ,
    private lastName:string,
    private id?: number) {}

    toPayload(): UserPayload {
      return {
        email: this.email,
        plainPassword: this.plainPassword,
        confirmationPassword: this.confirmationPassword,
        firstName: this.firstName,
        lastName: this.lastName,
      };
    }
}
