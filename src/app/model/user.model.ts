import { Role } from "./role.model";
export class User {
    id:number;
    email:string;
    username:string;
    role:Role;
    valid:boolean;
    password:string;
}