class ChatGroup {
    constructor(_id, name, members, admins, createdBy, childrenChatGroups){
        this._id = _id;
        this.name = name;
        this.members = members;
        this.admins = admins;
        this.createdBy = createdBy;
        this.childrenChatGroups = childrenChatGroups;
    }
    _id;
    parent;
    name;
    members;
    admins;
    createdBy;
    childrenChatGroups;
}
module.exports = { ChatGroup }