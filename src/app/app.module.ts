import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SocketService } from "./services/socket.service";
import { ChatGroupListComponent } from './chat-group-list/chat-group-list.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { LoginComponent } from './login/login.component';
import { AuthService } from "./services/authentication/auth.service";
import { HttpClientModule } from "@angular/common/http";
import { UserHelper } from "./helpers/userHelper.helper";
import { UserEditComponent } from './access/user-edit/user-edit.component';
import { UserSubListComponent } from './access/user-sub-list/user-sub-list.component';
import { UserService } from "./services/user/user.service";
import { NgToggleModule } from "@nth-cloud/ng-toggle";
import { GroupComponent } from './group/group-eidt/group.component';
import { GroupSubListComponent } from './group/group-sub-list/group-sub-list.component';
import { GroupHelper } from "./helpers/groupHelper.helper";
import { GroupService } from "./services/group/group.service";
import { UserPortraitComponent } from './access/user-portrait/user-portrait.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatGroupListComponent,
    ChatPageComponent,
    LoginComponent,
    UserEditComponent,
    UserSubListComponent,
    GroupComponent,
    GroupSubListComponent,
    UserPortraitComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgToggleModule,
    FontAwesomeModule
  ],
  providers: [SocketService,
    AuthService,
    UserHelper,
    GroupHelper,
    UserService,
    GroupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIconPacks(far);
  }
}
