import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, Events, LoadingController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { RequestsProvider } from '../../../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {

  friends:any;
  friend:any;
  amount:number
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions,public toastCtrl: ToastController,
    public events: Events ,public loadingCtrl: LoadingController,public requestService: RequestsProvider) {
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
    this.loading.present();
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
      this.goBack();
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

}
