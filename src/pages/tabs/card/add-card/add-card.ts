import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ApiClientService } from '../../../../client';
import { AngularFireAuth } from 'angularfire2/auth';


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
              public events: Events ,public loadingCtrl: LoadingController,private apiBlockchain: ApiClientService,
              private _auth: AngularFireAuth) {
                this.nameCard = this.cvv = this.date = "";
  }

  ionViewDidEnter(){
   console.log("Add credit card")
  }

  addCard(){
    var loading = this.loadingCtrl.create();
    loading.present();
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
    }else{
      let card = {
        "$class": "org.transfer.tfg.AddCreditCard",
        "owner": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
        "ownerName": this.nameCard,
        "number": this.numberCard,
        "expireDate": this.date,
        "cvv": this.cvv,
        "addTime": new Date()
      }
      this.apiBlockchain.addCreditCard(card).subscribe(
        result =>{
          console.log(result)
          loading.dismiss();
          this.goBack();
        },
        error=>{
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
}
