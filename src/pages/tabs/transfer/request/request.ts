import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, Events, LoadingController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { RequestsProvider } from '../../../../providers/requests/requests';
import { ApiClientService } from '../../../../client';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {

  destinationId: any;
  friends:any;
  friend:any;
  amount:number
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions,public toastCtrl: ToastController,
    public events: Events ,public loadingCtrl: LoadingController,public requestService: RequestsProvider,
    private _auth: AngularFireAuth, private apiBlockchain: ApiClientService) {
  }

  ionViewWillEnter() {
    this.requestService.getFriends();
    this.events.subscribe('friends', () => {
      this.friends = [];
      this.friends = this.requestService.myfriends;
      this.loading.dismiss()
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('friends');
  }

  request(){
    if(this.friend==""){
      let error="Debes elegir una amigo"
      this.showToast(error);
    }else if(this.amount == null || !this.amount){
      let error="Debes introducir una cantidad";
      this.showToast(error);
    }else{
      var loading = this.loadingCtrl.create();
      loading.present();
      let request = {
        "$class": "org.transfer.tfg.RequestMoney",
        "origin": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
        "destination": "resource:org.transfer.tfg.User#" + this.destinationId,
        "amount": this.amount,
        "date": new Date()
      }
      this.apiBlockchain.sendMoney(request).subscribe(
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

  goBack(){
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
