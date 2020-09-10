import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group/group.service';
import { ChatGroup } from "../../model/chatGroup";
import { GroupHelper } from 'src/app/helpers/groupHelper.helper';
import { GroupPath } from 'src/app/model/groupPath.model';
import { ObjectUnsubscribedError } from 'rxjs';
import { User } from 'src/app/model/user.model';
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

  constructor(private groupService: GroupService, private groupHelper: GroupHelper) { 
    this.refreshGroupList();
    this.groupHelper.getCurrentSelectedGroup().subscribe(cg => this.currentSelectedGroup = cg);
    this.groupHelper.getCurrentGroupList().subscribe(gs => this.groups = gs);
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
    this.currentSelectedGroup = g;
    this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
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
