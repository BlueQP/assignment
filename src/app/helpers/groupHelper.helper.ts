import { Injectable } from '@angular/core';
import { User } from "../model/user.model";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ChatGroup } from '../model/chatGroup';
import { GroupPath } from "../model/groupPath.model";

@Injectable()
export class GroupHelper {
  public currentSelectedGroup: ChatGroup;
  public currentSelectedGroupObservable: Subject<ChatGroup> = new Subject<ChatGroup>();
  public currentGroupList: Array<ChatGroup>;
  public currentGroupListObservable: Subject<Array<ChatGroup>> = new Subject<Array<ChatGroup>>();
  public currentCreatingChildPath: GroupPath;
  public currentCreatingChildPathObservable: Subject<GroupPath> = new Subject<GroupPath>();
  constructor() {

  }

  public setCurrentSelectedGroup(g: ChatGroup) {
    this.currentSelectedGroup = g;
    this.currentSelectedGroupObservable.next(this.currentSelectedGroup);
  }

  public getCurrentSelectedGroup(): Observable<ChatGroup> {
    this.currentSelectedGroupObservable.next(this.currentSelectedGroup);
    return this.currentSelectedGroupObservable.asObservable();
  }

  public setCurrentGroupList(gl:Array<ChatGroup>){
    this.currentGroupList = gl;
    this.currentGroupListObservable.next(this.currentGroupList);
  }

  public getCurrentGroupList():Observable<Array<ChatGroup>>{
    this.currentGroupListObservable.next(this.currentGroupList);
    return this.currentGroupListObservable.asObservable();
  }

  public recursiveSearchGroupById(id:Object, groupCollection:Array<ChatGroup>):ChatGroup{
    if (groupCollection!= null && groupCollection.length >=1){
      for (var g of groupCollection){
        if (g._id == id){
          return g;
        }
        else {
          var result = this.recursiveSearchGroupById(id, g.childrenChatGroups);
          if (result != null){
            return result;
          }
        }
      }
    }
  }

  public getParentGroup(child:ChatGroup, groupCollection:Array<ChatGroup>):ChatGroup{
    return this.recursiveSearchGroupById(child.parent, groupCollection);
  }

  public findInChildrenGroup(targetID:Object, parent:ChatGroup):ChatGroup{
    return this.recursiveSearchGroupById(targetID, parent.childrenChatGroups);
  }

  public updateRootObjectChild(child:ChatGroup, root:ChatGroup):ChatGroup{
    var childOld = this.findInChildrenGroup(child._id, root);
    childOld = child;
    return root;
  }

  public findPathFromRootToChild(child:ChatGroup, groupCollection:Array<ChatGroup>, path: GroupPath):GroupPath{
    if (path == null){
      path = new GroupPath();
    }
    else if (path.indexPath == null){
      path.indexPath = [];
    }

    if (child.parent != null && child.parent.toString().length >= 1){
      var parent = this.recursiveSearchGroupById(child.parent, groupCollection);
      if (parent.childrenChatGroups != null){
        path.indexPath.unshift(parent.childrenChatGroups.indexOf(child));
        path.root = parent;
      }
      this.findPathFromRootToChild(parent, groupCollection, path);
    }
    else{
      path.root = child;
      path.indexPath = [];
    }
    return path;
  }

  public setCreateChildGroupFullPath(path:GroupPath){
    this.currentCreatingChildPath = path;
    this.currentCreatingChildPathObservable.next(this.currentCreatingChildPath);
  }

  public getCreateChildGroupFullPath():Observable<GroupPath>{
    this.currentCreatingChildPathObservable.next(this.currentCreatingChildPath);
    return this.currentCreatingChildPathObservable.asObservable();
  }

  public findGroupBasedOnPath(path:GroupPath):ChatGroup{
    var rootG = path.root;
    var indexPath = path.indexPath;
    var childGroupPointer:ChatGroup = rootG;
    for (var index of indexPath){
      childGroupPointer = childGroupPointer.childrenChatGroups[index];
    }
    return childGroupPointer;
  }

  public updateCurrentGroupsList(newGroup:ChatGroup){
    this.currentGroupList.filter(g => {return g._id == newGroup._id})[0] = newGroup;
    this.setCurrentGroupList(this.currentGroupList);
  }
}
