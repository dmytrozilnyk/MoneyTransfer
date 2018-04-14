import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiClientService } from '../../../../client';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  change: boolean;
  seguridad: boolean;
  deposite: boolean;
  remove: boolean;
  send: boolean;
  withdraw: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public loadingCtrl: LoadingController, private storage: Storage, private apiBlockchain: ApiClientService,
    private _auth: AngularFireAuth) {
      this.change = false;
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('Atras');
    var loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('user').then((result) => {
      let user = result[0];
      this.seguridad = user.security;
      this.deposite = user.securityValue.deposite;
      this.remove = user.securityValue.remove;
      this.send = user.securityValue.send;
      this.withdraw = user.securityValue.withdraw;
      console.log(user);
      loading.dismiss();
    });
  }

  setSecurity() {
    if(this.change){
      var loading = this.loadingCtrl.create();
      loading.present();
      if (this.seguridad) {
        var security = {
          "$class": "org.transfer.tfg.SecurityOptions",
          "user": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
          "security": this.seguridad,
          "securityValue": {
            "$class": "org.transfer.base.Security",
            "remove": this.remove,
            "deposite": this.deposite,
            "send": this.send,
            "withdraw": this.withdraw
          }
        }
      } else {
        var security = {
          "$class": "org.transfer.tfg.SecurityOptions",
          "user": "resource:org.transfer.tfg.User#" + this._auth.auth.currentUser.uid,
          "security": false,
          "securityValue": {
            "$class": "org.transfer.base.Security",
            "remove": false,
            "deposite": false,
            "send": false,
            "withdraw": false
          }
        }
      }
      this.apiBlockchain.securityOptions(security).subscribe(
        result => {
          console.log(result);
          this.apiBlockchain.getUserId(this._auth.auth.currentUser.uid).subscribe(
            result => {
              loading.dismiss();
              this.storage.set('user', result.body);
              this.navCtrl.pop();
            },
            error => {
              loading.dismiss();
              console.log(error);
              this.navCtrl.pop();
            });
        },
        error => {
          loading.dismiss();
          console.log(error);
        });
    }else{
      this.navCtrl.pop();
    }
  }

  onSelectChange(selectedValue:any){
    this.change = true;
  }


}