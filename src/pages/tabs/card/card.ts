import { AddCardPage } from './add-card/add-card';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }

  addCard(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(AddCardPage);
  }

}
