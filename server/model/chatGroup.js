class ChatGroup {
    constructor(_id, name, members, admins, createdBy, childrenChatGroups, messages){
        this._id = _id;
        this.name = name;
        this.members = members;
        this.admins = admins;
        this.createdBy = createdBy;
        this.childrenChatGroups = childrenChatGroups;
        this.messages = messages;
    }
    _id;
    parent;
    name;
    members;
    admins;
    createdBy;
    childrenChatGroups;
    messages;
}
module.exports = { ChatGroup }