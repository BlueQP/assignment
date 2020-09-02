import { User } from "./user.model";
export class LoginResponse{
    ok:boolean;
    user: User;
    status: boolean;
    errorMessage: String;
}