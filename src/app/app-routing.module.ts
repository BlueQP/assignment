import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatPageComponent } from "./chat-page/chat-page.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [{path: '', component: ChatPageComponent},
{path:'login', component: LoginComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
