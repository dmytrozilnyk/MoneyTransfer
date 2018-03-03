import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { SetpasswordPage } from '../setpassword/setpassword';
import { ApiClientService } from '../../client';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;
  loading: Loading;

  constructor(public navCtrl: NavController, private faio: FingerprintAIO,
    public loadingCtrl: LoadingController, private _auth: AngularFireAuth,
    private apiBlockChain: ApiClientService, public toastCtrl: ToastController) {
    this.email = this.password = "";
  }

  ionViewDidLoad() { 
  }  

  //Función de inicio de sesión
  login(): void {
    
    if (this.email == "" || this.password == "") {
      var error = "Los campos no pueden estar vacíos";
      this.showToast(error);
    } else {
      this._auth.auth.signInWithEmailAndPassword(this.email, this.password).then((res) => {
        var credential={
          "$class": "org.transfer.tfg.Login",
          "user": "resource:org.transfer.tfg.User#"+this._auth.auth.currentUser.uid,
        }
        this.apiBlockChain.login(credential).subscribe(
          result=>{
            console.log(<any>result);
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
            this.email = this.password = "";
          },
          error=>{
            console.log(<any>error);
            this.showToast(error.body);
            this.loading.dismiss();
            this.email = this.password = "";
          }
        )
      }, (err) => {
        console.log(err.code);
        this.loading.dismiss().then(() => {
          if (err.code == "auth/invalid-email") {
            let error = "El formato del correo no es válido";
            this.showToast(error);
            this.email = this.password = "";
          } else if (err.code == "auth/wrong-password") {
            let error = "La contraseña es incorrecta";
            this.showToast(error);
            this.password = "";
          } else if (err.code == "auth/user-not-found") {
            let error = "El usuario no existe";
            this.showToast(error);
            this.email = this.password = "";
          }
        });
      });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  //Función inicio de seccion con Facebook
  loginWithFacebook() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup:true,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
  })
  .then((result: any) => this.navCtrl.setRoot(TabsPage))
  .catch((error: any) => console.log(error));

  }

  //Funcion que nos lleva a la página del registro
  registry() {
    this.navCtrl.push(RegisterPage);
  }

  //Función de cambio de contraseña 
  setPassword() {
    this.navCtrl.push(SetpasswordPage)
  }

/***************Funciones auxiliares***************/

  //Funciones auxiliares 
  showToast(error) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true,
      cssClass: "toastStyle"
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
