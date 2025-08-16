export class User {

  email?: string
  plainPassword?: string
  confirmPassword?:string
  firstname?: string
  lastname?: string

  /**
   * 
   * @param email 
   * @param plainPassword 
   * @param confirmPassword 
   * @param firstname 
   * @param lastname 
   */
  constructor(email:string , plainPassword:string,confirmPassword:string, firstname:string ,lastname:string) {

    this.email = email;
    this.plainPassword = plainPassword;
    this.confirmPassword = confirmPassword ;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}