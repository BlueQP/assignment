import { User } from "./user.model";
import { Message } from './message.model';
export class ChatGroup {
    _id:Object;
    parent:Object;
    name:string;
    members:Object[];
    admins:Object[];
    fatherChatGroup:ChatGroup;
    messages:Message[];
    childrenChatGroups:ChatGroup[];
}