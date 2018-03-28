import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { ChatProvider } from '../../../../providers/chat/chat';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  friend: any;
  newMessage;
  allMessages = [];
  photoURL;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public chatService: ChatProvider,public events: Events,
              public zone: NgZone) {
    this.friend = this.chatService.friend;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allMessages = [];
      this.zone.run(() => {
        this.allMessages = this.chatService.friendMessages;
      });
    });
  }

  ionViewDidEnter() {
    this.chatService.getFriendMessages();
  }

  addMessage() {
    this.chatService.addNewMessage(this.newMessage).then(() => {
      this.content.scrollToBottom();
      this.newMessage = '';
    })
  }
 
  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 500);
  }

  acctions(){
    console.log();
  }

}
