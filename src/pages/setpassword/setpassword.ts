import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-setpassword',
  templateUrl: 'setpassword.html',
})
export class SetpasswordPage {

  email: string;

  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _auth: AngularFireAuth, public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    this.email = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetpasswordPage');
  }

  //Función para cambiar la contraseña
  resetPassword() {
    if (this.email == "") {
      let error = "Introduce un correo electrónico";
      this.showToast(error);
    } else {
      firebase.auth().sendPasswordResetEmail(this.email).then(
        (res) => {
          this.loading.dismiss()
          this.showAlert();
        },
        (err) => {
          this.loading.dismiss().then(() => {
            console.log(<any>err)
            if (err.code == "auth/argument-error") {
              let error = "Introduce un correo electrónico";
              this.showToast(error);
              this.email=""
            } else if (err.code == "auth/user-not-found") {
              let error = "El usuario no existe";
              this.showToast(error);
              this.email=""
            } else if (err.code == "auth/invalid-email") {
              let error = "El formato del correo no es válido";
              this.showToast(error);
              this.email=""
            }
          });
        });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  //Función para volver a la página de inicio
  goBack() {
    this.navCtrl.pop();
  }

  /***************Funciones auxiliares***************/

  //Función para mostrat el toast 
  showToast(error) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true,
      cssClass: "toastStyle",
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  //Función para mostrat la alerta
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Atención!',
      subTitle: 'Recibiras un correo para restablecer la contraseña',
      buttons: [{
        text:'OK',
        handler: data => {
          this.navCtrl.pop();
        }
      }],
      cssClass:"alertStyle"
    });
    alert.present();
  }

}
