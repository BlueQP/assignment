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


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatGroupListComponent,
    ChatPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
