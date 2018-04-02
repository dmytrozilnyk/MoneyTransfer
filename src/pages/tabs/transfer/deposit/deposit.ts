import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController, Loading } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AddCardPage } from '../../card/add-card/add-card';

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  amount:number;
  card = "";
  cards = [1];
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions,public toastCtrl: ToastController,
    public events: Events ,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    
  }

  deposit(){
    if(this.card==""){
      let error="Debes elegir una tarjeta";
      this.showToast(error);
    }else if(this.amount == null || !this.amount){
      let error="Debes introducir una cantidad";
      this.showToast(error);
    }else{
      this.goBack();
    }
  }
  
  addCard(){
    this.navCtrl.push(AddCardPage);
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
      this.goBack();
    });
    toast.present();
  }
}
