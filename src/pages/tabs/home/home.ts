import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { DetailsPage } from './details/details';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  amount = 0;
  cantidad = 152;
  setInterval;
  moves;
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
              private _auth: AngularFireAuth,public app: App) {
          this.moves = ['1','1','2','1','1','2','1','1','2','1'];
  }

  ionViewDidLoad() {
     this.setInterval =  setInterval(() =>{this.setAmount()}, 0);
  }

  setAmount(){
    if(this.amount>=this.cantidad){
      this.amount = this.amount - 1;
      clearInterval(this.setInterval);
    }
    this.amount = this.amount + 1
  }

  goDetails(){
    this.app.getRootNav().push(DetailsPage);
  }
}
