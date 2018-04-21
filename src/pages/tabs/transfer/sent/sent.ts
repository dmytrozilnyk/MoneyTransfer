import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController, Loading } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { RequestsProvider } from '../../../../providers/requests/requests';
import { AngularFireAuth } from 'angularfire2/auth';
import { ApiClientService } from '../../../../client';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-sent',
  templateUrl: 'sent.html',
})
export class SentPage {

  userSecurity: any;
  destinationId: any;
  friends: any;
  friend: any;
  amount: number
  loading: Loading;
  sent:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions, public toastCtrl: ToastController,
    public events: Events, public loadingCtrl: LoadingController, public requestService: RequestsProvider,
    private _auth: AngularFireAuth, private apiBlockchain: ApiClientService, private storage: Storage,
    private faio: FingerprintAIO) {
  }

  ionViewWillEnter() {
    this.requestService.getFriends();
    this.storage.get('user').then((result) => {
      let user = result[0];
      this.userSecurity = user.securityValue;
      if(this.userSecurity == null){
        this.sent == false;
      }else{
        this.sent = this.userSecurity.send;
      }
    });
    this.events.subscribe('friends', () => {
      this.friends = [];
      this.friends = this.requestService.myfriends;
      this.loading.dismiss()
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  ionViewDidLeave() {
    this.events.unsubscribe('friends');
  }

  send() {
    if (this.friend == "") {
      let error = "Debes elegir una amigo"
      this.showToast(error);
    } else if (this.amount == null || !this.amount) {
      let error = "Debes introducir una cantidad";
      this.showToast(error);
    } else {
      console.log(this.destinationId)
      let sent = {
        "$class": "org.transfer.tfg.SendMoney",
        "origin": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
        "destination": "resource:org.transfer.tfg.User#" + this.destinationId,
        "amount": this.amount,
        "date": new Date()
      }
      if (this.sent == true) {
        var loading = this.loadingCtrl.create();
        loading.present();
        this.faio.show({
          clientId: 'Fingerprint-Demo',
          clientSecret: 'password', //Only necessary for Android
          disableBackup: true,  //Only for Android(optional)
          localizedFallbackTitle: 'Use Pin', //Only for iOS
          localizedReason: 'Please authenticate' //Only for iOS
        })
          .then((result: any) => {
            this.apiBlockchain.sendMoney(sent).subscribe(
              result => {
                console.log(result);
                loading.dismiss();
                this.goBack();
              },
              error => {
                console.log(error)
                loading.dismiss();
              });
          })
          .catch((error: any) => console.log(error));
      } else {
        var loading = this.loadingCtrl.create();
        loading.present();
        this.apiBlockchain.sendMoney(sent).subscribe(
          result => {
            console.log(result);
            loading.dismiss();
            this.goBack();
          },
          error => {
            console.log(error)
            loading.dismiss();
          });
      }
    }
  }

  goBack() {
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500
    };
    this.nativePageTransitions.slide(options);
    this.navCtrl.pop();
  }

  showToast(error) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true,
      cssClass: "toastStyle",
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  getId(user) {
    this.destinationId = user.uid;
  }
}

