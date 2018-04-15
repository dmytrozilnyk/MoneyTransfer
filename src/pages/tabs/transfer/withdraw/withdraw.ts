import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AddCardPage } from '../../card/add-card/add-card';
import { Storage } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { ApiClientService } from '../../../../client';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  userSecurity: any;
  creditCardId: any;
  amount: number;
  card = "";
  cards: any;
  loading: Loading;
  isCard: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions, public toastCtrl: ToastController,
    public events: Events, public loadingCtrl: LoadingController, private faio: FingerprintAIO,
    private storage: Storage, private apiBlockchain: ApiClientService, private _auth: AngularFireAuth) {
  }

  ionViewDidLoad() {
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

  withdraw() {
    if (this.card == "") {
      let error = "Debes elegir una tarjeta";
      this.showToast(error);
    } else if (this.amount == null || !this.amount) {
      let error = "Debes introducir una cantidad";
      this.showToast(error);
    } else {
      let withdraw = {
        "$class": "org.transfer.tfg.WithdrawMoney",
        "user": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
        "creditCard": "resource:org.transfer.tfg.CreditCard#" + this.creditCardId,
        "amount": this.amount,
        "date": new Date()
      }
      if (this.userSecurity.withdraw == true) {
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
            this.apiBlockchain.withdrawMoney(withdraw).subscribe(
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
        this.apiBlockchain.withdrawMoney(withdraw).subscribe(
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

  addCard() {
    this.navCtrl.push(AddCardPage);
  }

  creditCard(card) {
    this.creditCardId = card.creditCardId;
    console.log(this.creditCardId);
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
