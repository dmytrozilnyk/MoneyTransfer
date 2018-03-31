import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-sent',
  templateUrl: 'sent.html',
})
export class SentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SentPage');
  }

  goBack(){
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500
    };

    this.nativePageTransitions.slide(options);
    this.navCtrl.pop();
  }

}
