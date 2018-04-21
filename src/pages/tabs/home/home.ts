import { ApiClientService } from './../../../client/index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { DetailsPage } from './details/details';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { WithdrawPage } from '../transfer/withdraw/withdraw';
import { DepositPage } from '../transfer/deposit/deposit';
import { Storage } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  userSecurity: any;
  amount: number;
  setInterval;
  moves = [];
  filter = "all";
  arrayPositive = [];
  arrayNegative = [];
  requests =[];
  myId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    private _auth: AngularFireAuth, public app: App, private nativePageTransitions: NativePageTransitions,
    public apiBlockchain: ApiClientService, private storage: Storage,public loadingCtrl: LoadingController,
    private faio: FingerprintAIO) {
  }

  ionViewWillEnter(){
    this.myId = 'resource:org.transfer.tfg.User#' + this._auth.auth.currentUser.uid;
    this.moves = [];
    this.arrayPositive = [];
    this.arrayNegative = [];
    var loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('user').then((result) => {
      let user = result[0];
      this.userSecurity = user.securityValue;
    });
    this.apiBlockchain.getUserId(this._auth.auth.currentUser.uid).subscribe(
      result => {
        console.log(result);
        this.storage.set('user', result.body);
        this.amount = result.body[0].amount;
        this.apiBlockchain.getUserOperations(this._auth.auth.currentUser.uid).subscribe(
          result => {
            this.apiBlockchain.getUserRequest(this._auth.auth.currentUser.uid).subscribe(
              result =>{
                this.requests = result.body;
                console.log(this.requests)
                loading.dismiss();
              },
              error=>{
                console.log(error);
                loading.dismiss();
              }); 
            console.log(result);
            this.moves = result.body;
            for (let i = 0; i < this.moves.length; i++) {
              if(this.moves[i].type == 'DEPOSIT'){
                this.arrayPositive.push(this.moves[i]);
              }else if(this.moves[i].type == 'WITHDRAW'){
                this.arrayNegative.push(this.moves[i]);
              }else if(this.moves[i].type == 'SENT'){
                if(this.moves[i].user == 'resource:org.transfer.tfg.User#'+this._auth.auth.currentUser.uid){
                  this.arrayNegative.push(this.moves[i]);
                }else{
                  this.arrayPositive.push(this.moves[i]);
                }
              }
              else if(this.moves[i].type == 'REQUEST'){
                if(this.moves[i].user == 'resource:org.transfer.tfg.User#'+this._auth.auth.currentUser.uid){
                  this.arrayPositive.push(this.moves[i]);
                }else{
                  this.arrayNegative.push(this.moves[i]);
                }
              }
            }
          },
          error => {
            console.log(error);
            loading.dismiss();
          });
      },
      error => {
        console.log(error);
        loading.dismiss();
      });
  }
  acceptRequest(request){
    let acceptReq = {
      "$class": "org.transfer.tfg.AcceptRequest",
      "request": "resource:org.transfer.tfg.Request#" + request.requestId,
      "date": new Date()
    }
    if (this.userSecurity.remove == true) {
      var loading = this.loadingCtrl.create();
      loading.present();
      this.faio.show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'password', //Only necessary for Android
        disableBackup: true,  //Only for Android(optional)
        localizedFallbackTitle: 'Use Pin', //Only for iOS
        localizedReason: 'Please authenticate' //Only for iOS
      })
        .then((result: any) => {
          this.apiBlockchain.acceptRequest(acceptReq).subscribe(
            result => {
              console.log(result);
              for (var j = 0; j < this.requests.length; j++) {
                if (this.requests[j].requestId === request.requestId) {
                    this.requests.splice(j, 1);
                }
              }
              loading.dismiss();
            },
            error => {
              console.log(error)
              loading.dismiss();
            });
        })
        .catch((error: any) => console.log(error));
    } else {
      var loading = this.loadingCtrl.create();
      loading.present();
      this.apiBlockchain.acceptRequest(acceptReq).subscribe(
        result => {
          console.log(result);
          for (var j = 0; j < this.requests.length; j++) {
            if (this.requests[j].requestId === request.requestId) {
                this.requests.splice(j, 1);
            }
          }
          loading.dismiss();
        },
        error => {
          console.log(error)
          loading.dismiss();
        });
    }
  }
  rejectRequest(request){
    var loading = this.loadingCtrl.create();
    loading.present();
    let rejectReq = {
      "$class": "org.transfer.tfg.RejectRequest",
      "request": "resource:org.transfer.tfg.Request#" + request.requestId,
      "date": new Date()
    }
    this.apiBlockchain.rejectRequest(rejectReq).subscribe(
      result => {
        console.log(result);
        for (var j = 0; j < this.requests.length; j++) {
          if (this.requests[j].requestId === request.requestId) {
              this.requests.splice(j, 1);
          }
        }
        loading.dismiss();
      },
      error => {
        console.log(error)
        loading.dismiss();
      });
  }
  goDetails(move) {
    this.app.getRootNav().push(DetailsPage,{'move':move});
  }

  openWithdraw() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
    };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(WithdrawPage);
  }

  openDeposit() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
    };
    this.nativePageTransitions.slide(options)
    this.navCtrl.push(DepositPage);
  }
}
