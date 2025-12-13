import { UserPayload } from "../interfaces/user-payload.interface";

export class User {

  /**
   * Creates an instance of User.
   * @param email - User's email
   * @param plainPassword - User's plain password
   * @param confirmationPassword - User's confirmation password
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @param id - Optional user ID
   */
  constructor(
    private email:string , 
    private plainPassword:string, 
    private confirmationPassword:string, 
    private firstName:string ,
    private lastName:string,
    private id?: number) {}

  /**
   * Converts the User instance to a UserPayload object.
   * @returns UserPayload representation of the User instance
   */
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
