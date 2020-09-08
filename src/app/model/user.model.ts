import { Role } from "./role.model";
export class User {
    _id:Object;
    id:number;
    email:string;
    username:string;
    role:Role;
    valid:boolean;
    password:string;
}