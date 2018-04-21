import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  user: any;
  myId: string;
  details: any;
  amount:any;
  type:string;
  nameDestination:string;
  nameOrigin:string;
  day:string;
  hour:string;
  category:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _auth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.myId = 'resource:org.transfer.tfg.User#' + this._auth.auth.currentUser.uid;
    this.details = this.navParams.get('move');
    this.user = this.details.user;
    this.amount = this.details.amount;
    this.type = this.details.type;
    this.nameDestination = this.details.nameDestination;
    this.nameOrigin = this.details.nameOrigin;
    var date = new Date(this.details.date);
    this.day = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    this.hour = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if(this.type === 'DEPOSIT'){
      this.category = 'Ingresado';
    }else if(this.type === 'REQUEST'){
      if(this.user == this.myId){
        this.category = 'Recibido';
      }else{
        this.category = 'Enviado';
      }
    }else if(this.type === 'WITHDRAW'){
      this.category = 'Retirado';
    }else if(this.type === 'SENT'){
      if(this.user == this.myId){
        this.category = 'Enviado';
      }else{
        this.category = 'Recibido';
      }
    }
  }

  goBack(){
    this.navCtrl.pop();
  }

}