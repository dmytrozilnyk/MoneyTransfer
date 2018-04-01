import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html',
})
export class QrPage {

  createdCode = null;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    this.createdCode = firebase.auth().currentUser.uid;
    console.log(this.createdCode);
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
