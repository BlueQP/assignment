import { User } from "./user.model";
export class Message {
    messageBody:string;
    timestamp:Date;
    sentBy:User;
}