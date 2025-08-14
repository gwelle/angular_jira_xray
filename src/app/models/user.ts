export class User {

  email?: string
  password?: string
  confirmPassword?:string
  firstname?: string
  lastname?: string

  /**
   * 
   * @param email 
   * @param password 
   * @param confirmPassword 
   * @param firstname 
   * @param lastname 
   */
  constructor(email:string , password:string,confirmPassword:string, firstname:string ,lastname:string) {

    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword ;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}