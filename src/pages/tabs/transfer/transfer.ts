import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { RequestPage } from './request/request';
import { SentPage } from './sent/sent';
import { WithdrawPage } from './withdraw/withdraw';
import { DepositPage } from './deposit/deposit';

@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferPage');
  }
  
  openDeposit(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(DepositPage);
  }

  openRequest(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(RequestPage);
  }

  openSent(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(SentPage);
  }

  openWithdraw(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(WithdrawPage);
  }

}
