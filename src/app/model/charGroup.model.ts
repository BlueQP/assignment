import { User } from "./user.model";
export class ChatGroup {
    id:number;
    name:string;
    members:User[];
    admins:User[];
    fatherChatGroup:ChatGroup;
    childrenChatGroups:ChatGroup[];
}