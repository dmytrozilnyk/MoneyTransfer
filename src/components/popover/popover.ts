import { SentPage } from './../../pages/tabs/transfer/sent/sent';
import { Component } from '@angular/core';
import { ViewController, NavParams, NavController, Events } from 'ionic-angular';
import { RequestPage } from '../../pages/tabs/transfer/request/request';
import firebase from 'firebase';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  user:any
  constructor(public viewCtrl: ViewController,public navCtrl: NavController,
              public navParams: NavParams, public events: Events) {
              }
              
  goSend() {
    this.viewCtrl.dismiss();
    this.navCtrl.push(SentPage);
  }
  goRequest(){
    this.viewCtrl.dismiss();
    this.navCtrl.push(RequestPage);
  }
}
