import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatPageComponent } from "./chat-page/chat-page.component";
import { LoginComponent } from "./login/login.component";
import { UserEditComponent } from "./access/user-edit/user-edit.component";
import { GroupComponent } from "./group/group-eidt/group.component";

const routes: Routes = [{path: '', component: LoginComponent},
{path:'chat', component: ChatPageComponent},
{path:'accesscontrol/user', component:UserEditComponent},
{path:'groupControl', component:GroupComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
