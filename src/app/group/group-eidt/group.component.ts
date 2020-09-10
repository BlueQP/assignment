import { Component, OnInit } from '@angular/core';
import { ChatGroup } from 'src/app/model/chatGroup';
import { GroupHelper } from 'src/app/helpers/groupHelper.helper';
import { GroupService } from 'src/app/services/group/group.service';
import { User } from 'src/app/model/user.model';
import { map } from 'rxjs/operators';
import { GroupPath } from 'src/app/model/groupPath.model';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.less']
})
export class GroupComponent implements OnInit {
  currentSelectedGroup: ChatGroup = new ChatGroup();
  groupAssisList: Array<User>;
  availableGroupAssisList: Array<User>;
  usersInThisGroup: Array<User>;
  usersOutThisGroup: Array<User>;
  path: GroupPath;
  groups: Array<ChatGroup>;

  constructor(private groupHelper: GroupHelper, private groupService: GroupService) {
    
  }

  ngOnInit(): void {
    this.groupHelper.getCurrentSelectedGroup().subscribe(g => {
      this.currentSelectedGroup = g;
      this.getThisGroupAssis();
      this.getRestGroupAssis();
      this.getThisGroupMembers();
      this.getThisGroupOutsideUsers();
      this.getChildGroupPath();
      this.getAllGroups();
    });
  }

  getAllGroups(){
    this.groupHelper.getCurrentGroupList().subscribe(gs => this.groups = gs);
  }

  getChildGroupPath() {
    this.groupHelper.getCreateChildGroupFullPath().subscribe(p => this.path = p);
  }

  getRestGroupAssis() {
    this.groupService.getRestGroupAssis(this.currentSelectedGroup).subscribe(
      (assis: Array<User>) => {
        this.availableGroupAssisList = assis;
      }
    );
  }

  getThisGroupAssis() {
    this.groupService.getGroupAssis(this.currentSelectedGroup).subscribe(
      (assis: Array<User>) => {
        this.groupAssisList = assis;
      }
    );
  }

  getThisGroupMembers() {
    this.groupService.getUsersInThisGroup(this.currentSelectedGroup).subscribe(
      (members: Array<User>) => {
        this.usersInThisGroup = members;
      }
    );
  }

  getThisGroupOutsideUsers() {
    this.groupService.getUsersOutThisGroup(this.currentSelectedGroup).subscribe(
      (ou: Array<User>) => {
        this.usersOutThisGroup = ou;
      }
    );
  }

  addToGroupAssis(assis: User) {
    if (this.groupAssisList == null) {
      this.groupAssisList = [];
    }
    if (this.availableGroupAssisList == null) {
      this.availableGroupAssisList = [];
    }
    this.availableGroupAssisList.splice(this.availableGroupAssisList.indexOf(assis), 1);

    this.groupAssisList.push(assis);
    this.currentSelectedGroup.admins = this.groupAssisList.map((a) => {return a._id});
  }

  removeFromGroupAssis(assis: User) {
    if (this.groupAssisList == null) {
      this.groupAssisList = [];
    }
    if (this.availableGroupAssisList == null) {
      this.availableGroupAssisList = [];
    }
    this.groupAssisList.splice(this.groupAssisList.indexOf(assis), 1);
    this.availableGroupAssisList.push(assis);
    this.currentSelectedGroup.admins = this.groupAssisList.map((a) => {return a._id});
  }

  addToGroupMember(m: User) {
    if (this.usersOutThisGroup == null) {
      this.usersOutThisGroup = [];
    }

    this.usersOutThisGroup.splice(this.usersOutThisGroup.indexOf(m), 1);
    if (this.usersInThisGroup == null) {
      this.usersInThisGroup = [];
    }
    this.usersInThisGroup.push(m);
    this.currentSelectedGroup.members = this.usersInThisGroup.map((a) => {return a._id});
  }

  removeFromGroupMember(m: User) {
    if (this.usersInThisGroup == null) {
      this.usersInThisGroup = [];
    }

    this.usersInThisGroup.splice(this.usersInThisGroup.indexOf(m), 1);
    if (this.usersOutThisGroup == null) {
      this.usersOutThisGroup = [];
    }
    this.usersOutThisGroup.push(m);
    this.currentSelectedGroup.members = this.usersInThisGroup.map((a) => {return a._id});

  }

  save() {
    if (this.currentSelectedGroup._id == null) {
      if (this.currentSelectedGroup.parent != null) {
        this.groupHelper.getCreateChildGroupFullPath();
        var updatedRootGroup: ChatGroup;
        this.groupService.createSubGroup(this.path).subscribe(
          (rg: ChatGroup) => {
            updatedRootGroup = rg;
            this.currentSelectedGroup = this.groupHelper.findGroupBasedOnPath(this.path);
            this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
            this.groupService.getAllgroups().subscribe((gs: Array<ChatGroup>) => this.groupHelper.setCurrentGroupList(gs));
          }
        );
        
      }
      else {
        this.groupService.createRootGroup(this.currentSelectedGroup).subscribe((rt:ChatGroup)=>{
          this.currentSelectedGroup = rt;
          this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
          this.groupService.getAllgroups().subscribe((gs: Array<ChatGroup>) => this.groupHelper.setCurrentGroupList(gs));
        });
      }
    } else { //if this action stands for updating a sub-group
      if (this.currentSelectedGroup.parent != null) {
        this.groupHelper.getCurrentGroupList();
        this.path = this.groupHelper.findPathFromRootToChild(this.currentSelectedGroup, this.groups, new GroupPath());
        var updatedRootGroup: ChatGroup;
        this.path.root = this.groupHelper.updateRootObjectChild(this.currentSelectedGroup, this.path.root);
        console.log(this.path.root);
        this.groupService.updateSubGroup(this.path).subscribe((updatedRoot:ChatGroup) => {
          updatedRootGroup=updatedRoot;
          this.currentSelectedGroup = this.groupHelper.findGroupBasedOnPath(this.path);
          this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
          this.groupService.getAllgroups().subscribe((gs: Array<ChatGroup>) => this.groupHelper.setCurrentGroupList(gs));
        });
      }
      else{
        this.groupService.updateRootGroup(this.currentSelectedGroup).subscribe((rt:ChatGroup) => {
          this.currentSelectedGroup = rt;
          this.groupHelper.setCurrentSelectedGroup(this.currentSelectedGroup);
          this.groupService.getAllgroups().subscribe((gs: Array<ChatGroup>) => this.groupHelper.setCurrentGroupList(gs));
        });
      }
    }
    
  }


}
