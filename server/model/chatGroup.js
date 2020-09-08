class ChatGroup {
    constructor(name, members, admins, createdBy, childrenChatGroups){
        this.name = name;
        this.members = members;
        this.admins = admins;
        this.createdBy = createdBy;
        this.childrenChatGroups = childrenChatGroups;
    }
    _id;
    name;
    members;
    admins;
    createdBy;
    childrenChatGroups;
}
module.exports = { ChatGroup }