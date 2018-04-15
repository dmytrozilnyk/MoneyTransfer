import { AddCardPage } from './add-card/add-card';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ApiClientService } from '../../../client';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {

  cards:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private nativePageTransitions: NativePageTransitions,
              public loadingCtrl: LoadingController,private apiBlockchain: ApiClientService,private _auth: AngularFireAuth,
              public alertCtrl: AlertController) {
  }

  ionViewWillEnter(){
    var loading = this.loadingCtrl.create();
    loading.present();
    this.apiBlockchain.getUserCreditCard(this._auth.auth.currentUser.uid).subscribe(
      result =>{
        console.log(result);
        this.cards = result.body;
        loading.dismiss();
      },
      error=>{
        console.log(error)
        loading.dismiss();
      });
  }

  addCard(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(AddCardPage);
  }

  deleteCard(card,slidingItem:ItemSliding){
    let cardD = {
      "$class": "org.transfer.tfg.DeleteCreditCard",
      "owner": card.owner,
      "creditCard": "resource:org.transfer.tfg.CreditCard#" + card.creditCardId
    }

    let confirm = this.alertCtrl.create({
      title: 'Eliminar tarjeta',
      message: '¿Estas seguro de que quieres eliminar esta tarjeta?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            var loading = this.loadingCtrl.create();
            loading.present();
            this.apiBlockchain.deleteCreditCard(cardD).subscribe(
              result =>{
                console.log(result);
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
                loading.dismiss();
                slidingItem.close();
              },
              error=>{
                slidingItem.close();
                console.log(error)
                loading.dismiss();
              });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
