export class User {

  /**
   * Creates an instance of User.
   * @memberof User
   */
  constructor(private email:string , 
              private plainPassword:string, 
              private confirmPassword:string, 
              private firstName:string ,
              private lastName:string,
              private id?: number) {}


}