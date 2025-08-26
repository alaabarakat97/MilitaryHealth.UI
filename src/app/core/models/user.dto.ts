export interface UserDto {
  userId: number;
  username: string;
  password: string;
  role:string;
  doctorId:number;
  permissions:string;
  status:string;
  lastLogin:Date;
}