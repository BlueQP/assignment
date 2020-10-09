import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from 'src/app/services/group/group.service';
import { ChatGroup } from "../../model/chatGroup";
import { GroupHelper } from 'src/app/helpers/groupHelper.helper';
import { GroupPath } from 'src/app/model/groupPath.model';
import { ObjectUnsubscribedError } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UserHelper } from 'src/app/helpers/userHelper.helper';
import { Message } from '../../model/message.model';
import { SocketService } from 'src/app/services/socket.service';
import { SendMessage } from 'src/app/model/sendMessage.model';
declare var $:any;
@Component({
  selector: 'app-group-sub-list',
  templateUrl: './group-sub-list.component.html',
  styleUrls: ['./group-sub-list.component.less']
})
export class GroupSubListComponent implements OnInit {
  public groups:Array<ChatGroup>;
  public currentSelectedGroup: ChatGroup;
  private groupToBeDelete:ChatGroup;
  public currentLoginUser:User;
  public loggedIn:boolean;
  @Input() displayButtons:boolean = true;
  constructor(private groupService: GroupService, 
    private socketService: SocketService,
    private groupHelper: GroupHelper, private userHelper: UserHelper) { 
    this.refreshGroupList();
    this.groupHelper.getCurrentSelectedGroup().subscribe(cg => this.currentSelectedGroup = cg);
    this.groupHelper.getCurrentGroupList().subscribe(gs => this.groups = gs);
    this.userHelper.getUser().subscribe(u=> this.currentLoginUser = u);
    this.userHelper.getIsUserLoggedIn().subscribe(i => this.loggedIn = i);
    this.userHelper.refreashSession();
  }

  ngOnInit(): void {
  }

  refreshGroupList(){
    this.groupService.getAllgroups().subscribe((gs:Array<ChatGroup>) => {
      this.groups = gs;
      this.groupHelper.setCurrentGroupList(this.groups);
    });
  }
  createNewGroup(){
    this.groupHelper.setCurrentSelectedGroup(new ChatGroup());
  }

  selectGroup(g:ChatGroup){
    if (this.currentLoginUser.role.name == "Super Admin" || 
    this.currentLoginUser.role.name == "Group Admin" ||
    (this.currentLoginUser.role.name == "Group Assis" && g.admins!=null && g.admins.includes(this.currentLoginUser._id)) ||
    this.currentLoginUser.role.name == "Normal" && g.members!=null && g.members.includes(this.currentLoginUser._id) ){
      this.currentSelectedGroup = g;
      this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
      var message:Message = new Message();
      message.messageBody = this.currentLoginUser.username + " has joined.";
      message.sentBy = this.currentLoginUser;
      message.sendInGroup = g._id;
      message.timestamp = new Date();
      var p2g:GroupPath = new GroupPath();
      p2g = this.groupHelper.findPathFromRootToChild(g, this.groups, p2g);
      this.socketService.send(new SendMessage(message, p2g));
    }
    
  }

  removeGroup(g:ChatGroup){
    this.groupToBeDelete = g;
    $("#deleteConfirmationModal").modal();
  }
  confirmDelete(){
    this.groupHelper.getCurrentGroupList();
    var pathToDelete = new GroupPath();
    if (this.groupToBeDelete.parent == null){
      pathToDelete.root = this.groupToBeDelete;
      pathToDelete.indexPath = null;
    }
    else{
      pathToDelete = this.groupHelper.findPathFromRootToChild(this.groupToBeDelete, this.groups, pathToDelete);

    }
    this.groupService.deleteGroup(pathToDelete).subscribe((res:Array<ChatGroup>) => {
      $('#closeModalBtn').click();
      this.groupHelper.setCurrentGroupList(res);
    }
    );
  }
  createSubGroup(g:ChatGroup){
    var newGroup = new ChatGroup();
    newGroup.parent = g._id;
    if (g.childrenChatGroups == null){
      g.childrenChatGroups = [];
    }
    g.childrenChatGroups.push(newGroup);
    var path = this.groupHelper.findPathFromRootToChild(newGroup, this.groups, new GroupPath());
    console.log(path);
    this.groupHelper.setCreateChildGroupFullPath(path);
    this.groupHelper.setCurrentSelectedGroup(newGroup);
    
  }
}
