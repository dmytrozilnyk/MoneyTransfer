import { UserProvider } from './../../../../providers/user/user';
import { RequestsProvider } from './../../../../providers/requests/requests';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import firebase from 'firebase';
import { ConnRequest } from '../../../../models/interface/request';
import { QrPage } from './qr/qr';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-find-friends',
  templateUrl: 'find-friends.html',
})
export class FindFriendsPage {

  firefriends = firebase.database().ref('/friends');
  firedata = firebase.database().ref('/chat');
  friends: any;
  temparr = [];
  filteredUsers = [];
  loading: Loading;
  auxResult = [];
  newRequest = {} as ConnRequest;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public requestService: RequestsProvider, public userService: UserProvider,
    public events: Events,private nativePageTransitions: NativePageTransitions,
    private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    this.requestService.getFriends();
    this.userService.getallusers().then((res: any) => {
      this.auxResult = res;
      this.events.subscribe('friends', () => {
        this.friends = this.requestService.myfriends;
        for (var i = 0; i < this.friends.length; i++) {
          for (var j = 0; j < res.length; j++) {
            if (this.friends[i].uid == res[j].uid) {
              this.auxResult.splice(j, 1);
            }
          }
        }
      });
      this.filteredUsers = this.auxResult;
      this.temparr = this.auxResult;
      this.loading.dismiss();
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  searchUser(searchBar) {
    this.filteredUsers = this.temparr;
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

  sendRequest(recipient) {
    this.newRequest.sender = firebase.auth().currentUser.uid;
    this.newRequest.recipient = recipient.uid;
    if (this.newRequest.recipient == this.newRequest.sender) {
      alert("Tu siempre eres amigo de ti");
    } else {
      let successAlert = this.alertCtrl.create({
        title: 'Peticion enviada',
        subTitle: 'Tu petición a ' + recipient.displayName + ' ha sido enviada',
        buttons: ['Ok']
      });
      this.requestService.sendrequest(this.newRequest).then((res: any) => {
        if (res.success) {
          successAlert.present();
          let sentuser = this.filteredUsers.indexOf(recipient);
          this.filteredUsers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  openQR(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(QrPage);
  }

  openScanner(){
    this.barcodeScanner.scan().then(user =>{
      console.log(user);
      /*this.firefriends.child(firebase.auth().currentUser.uid).push({
        uid: user
      }).then(() => {
        this.firefriends.child(user).push({
          uid: firebase.auth().currentUser.uid
        });
      });
    }).catch(error =>{
      console.log(error);*/
    })
  }
}
