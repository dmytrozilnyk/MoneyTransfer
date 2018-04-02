import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';


@IonicPage()
@Component({
  selector: 'page-add-card',
  templateUrl: 'add-card.html',
})
export class AddCardPage {

  nameCard:string 
  numberCard: number
  date:string;
  cvv:string
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private nativePageTransitions: NativePageTransitions, public toastCtrl: ToastController,
              public events: Events ,public loadingCtrl: LoadingController) {
                this.nameCard = this.cvv = this.date = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCardPage');
  }

  addCard(){
    console.log(this.date)
    if(this.nameCard==""){
      let error="Debes introducir el nombre del titular";
      this.showToast(error);
    }else if(this.numberCard == null || !this.numberCard){
      let error="Debes introducir el número de la tarjeta";
      this.showToast(error);
    }else if(this.date == "" || !this.date){
        let error="Debes introducir la fecha de caducidad";
        this.showToast(error);
    }else if(this.cvv == "" || !this.cvv){
      let error="Debes introducir el CVV";
      this.showToast(error);
    }else if(typeof(this.cvv)!="number"){
      let error="El CVV debe ser un número";
      this.showToast(error);
      this.cvv = ""
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
      this.goBack();
    });
    toast.present();
  }
}
