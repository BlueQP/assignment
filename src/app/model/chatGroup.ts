import { User } from "./user.model";
export class ChatGroup {
    _id:Object;
    parent:Object;
    name:string;
    members:Object[];
    admins:Object[];
    fatherChatGroup:ChatGroup;
    childrenChatGroups:ChatGroup[];
}