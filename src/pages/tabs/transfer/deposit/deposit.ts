import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController, Loading } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AddCardPage } from '../../card/add-card/add-card';
import { ApiClientService } from '../../../../client';
import { AngularFireAuth } from 'angularfire2/auth';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  amount: number;
  card = "";
  cards: any;
  loading: Loading;
  creditCardId: string;
  isCard: boolean;
  userSecurity: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions, public toastCtrl: ToastController,
    public events: Events, public loadingCtrl: LoadingController, private apiBlockchain: ApiClientService,
    private _auth: AngularFireAuth, private faio: FingerprintAIO, private storage: Storage) {
    this.isCard = false;
  }

  ionViewWillEnter() {
    var loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('user').then((result) => {
      let user = result[0];
      this.userSecurity = user.securityValue;
    });
    this.apiBlockchain.getUserCreditCard(this._auth.auth.currentUser.uid).subscribe(
      result => {
        console.log(result);
        this.cards = result.body;
        if (result.body.length > 0) {
          console.log("Si enstra")
          this.isCard = true;
        } else {
          this.isCard = false;
        }
        loading.dismiss();
      },
      error => {
        console.log(error)
        loading.dismiss();
      });
  }

  deposit() {
    if (this.card == "") {
      let error = "Debes elegir una tarjeta";
      this.showToast(error);
    } else if (this.amount == null || !this.amount) {
      let error = "Debes introducir una cantidad";
      this.showToast(error);
    } else {
      let deposit = {
        "$class": "org.transfer.tfg.DepositMoney",
        "user": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
        "creditCard": "resource:org.transfer.tfg.CreditCard#" + this.creditCardId,
        "amount": this.amount,
        "date": new Date()
      }
      if (this.userSecurity.deposite == true) {
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
            this.apiBlockchain.depositMoney(deposit).subscribe(
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
        this.apiBlockchain.depositMoney(deposit).subscribe(
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

  creditCard(card) {
    this.creditCardId = card.creditCardId;
    console.log(this.creditCardId);
  }

  addCard() {
    this.navCtrl.push(AddCardPage);
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
}
