export interface JWTPayload{
    userId:string;
    name:string;
    role:string;
    exp:number,
    email:string;
}