import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events, PopoverController } from 'ionic-angular';
import { ChatProvider } from '../../../../providers/chat/chat';
import firebase from 'firebase';
import { PopoverComponent } from '../../../../components/popover/popover';

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
              public zone: NgZone, public popoverCtrl: PopoverController) {
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

  action(event){
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: event
    });
  }

  goBack(){
    this.navCtrl.pop();
  }

}
