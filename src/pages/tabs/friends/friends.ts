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

  filteredUsers: any;
  request:boolean;
  requests: any[];
  friends: any[];
  loading: Loading;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestService: RequestsProvider, public events: Events,
    public alertCtrl: AlertController,public loadingCtrl: LoadingController,
    public chatService: ChatProvider) {
  }

  ionViewWillEnter() {
    this.request = false;
    this.requestService.getRequests();
    this.requestService.getFriends();
    this.friends = [];
    this.requests = [];
    this.events.subscribe('gotRequests', () => {
      this.requests = [];
      this.requests = this.requestService.userDetails;
      if(this.requests.length == 0){
        this.request = false;
      }else{
        this.request = true;
      }
    });
    this.events.subscribe('friends', () => {
      this.friends = [];
      this.friends = this.requestService.myfriends;
      this.filteredUsers = this.friends;
      this.loading.dismiss()
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotRequests');
    this.events.unsubscribe('friends');
  }

  goFindFriends() {
    this.navCtrl.push(FindFriendsPage)
  }

  friendChat(user) {
    this.chatService.initializebuddy(user);
    this.navCtrl.push(ChatPage); 
  }

  accept(user) {
    this.request = false;
    this.requestService.acceptRequest(user).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Amigo añadido',
        subTitle: 'Ya puedes chatear con tu amigo',
        buttons: ['Okay']
      });
      newalert.present();
    }).catch((err) => {
      alert(err);
    })
  }

  ignore(user) {
    this.request = false;
    this.requestService.deleteRequest(user).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Petición rechazada',
        buttons: ['Okay']
      });
      newalert.present();
    }).catch((err) => {
      alert(err);
    })
  }

  searchUser(searchBar) {
    this.filteredUsers = this.friends;
    var q = searchBar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.filteredUsers = this.filteredUsers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }
}
