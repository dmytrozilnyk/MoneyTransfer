import { ApiClientService } from './../../../client/index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { DetailsPage } from './details/details';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { WithdrawPage } from '../transfer/withdraw/withdraw';
import { DepositPage } from '../transfer/deposit/deposit';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  amount:number;
  setInterval;
  moves;
  filter = "all";
  arrayPositive = [];
  arrayNegative = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
              private _auth: AngularFireAuth,public app: App, private nativePageTransitions: NativePageTransitions,
              public apiBlockchain: ApiClientService, private storage: Storage) {
          this.moves = ['1','2','2','1','1','2','1','1','2','1'];
  }

  ionViewDidLoad() {
     this.amount = 259.5
    for (let i = 0; i < this.moves.length; i++) {
      if(this.moves[i] === '1'){
        this.arrayPositive.push(this.moves[i]);
      }else{
        this.arrayNegative.push(this.moves[i]);
      }
    }
    this.apiBlockchain.getUserId(this._auth.auth.currentUser.uid).subscribe(
      result=>{
        console.log(result);
        this.storage.set('user', result.body);
      },
      error=>{
        console.log(error)
      })
  }
  goDetails(){
    this.app.getRootNav().push(DetailsPage);
  }

  openWithdraw(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(WithdrawPage);
  }

  openDeposit(){
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(DepositPage);
  }
}
