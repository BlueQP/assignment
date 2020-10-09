import { GroupPath } from './groupPath.model'
import { Message } from './message.model';
export class SendMessage {
    pathToGroup: GroupPath;
    message: Message;
    constructor (m:Message, p: GroupPath){
        this.message = m;
        this.pathToGroup = p;
    }
}