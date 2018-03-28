import { ChatPage } from './chat/chat';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FindFriendsPage } from './find-friends/find-friends';
import { RequestsProvider } from './../../../providers/requests/requests';
import { ChatProvider } from './../../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  requestList: boolean;
  requests: any[];
  friends: any[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestService: RequestsProvider, public events: Events,
    public alertCtrl: AlertController,public loadingCtrl: LoadingController,
    public chatService: ChatProvider) {
  }

  ionViewWillEnter() {
    this.requestService.getRequests();
    this.requestService.getFriends();
    this.friends = [];
    this.events.subscribe('gotRequests', () => {
      this.requests = [];
      this.requests = this.requestService.userDetails;
      if(this.requests === []){
        this.requestList = false;
      }
    });
    this.events.subscribe('friends', () => {
      this.friends = [];
      this.friends = this.requestService.myfriends;
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotRequests');
  }

  goFindFriends() {
    this.navCtrl.push(FindFriendsPage)
  }

  friendChat(user) {
    this.chatService.initializebuddy(user);
    this.navCtrl.push(ChatPage); 
  }

  accept(user) {
    this.requestService.acceptRequest(user).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Amigo añadido',
        subTitle: 'Ya puedes chatear con tu amigo',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(user) {
    this.requestService.deleteRequest(user).then(() => {
      alert('Request ignored');
    }).catch((err) => {
      alert(err);
    })
  }
}
