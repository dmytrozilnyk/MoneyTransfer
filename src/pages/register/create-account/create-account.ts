import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Loading, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { LoginPage } from '../../login/login';
import { ApiClientService } from '../../../client';
import { ProfileFotoPage } from '../profile-foto/profile-foto';


@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  date: Date;
  country: string;
  name: string;
  lastName: string;

  number: string;
  email: string;
  password: string;
  passwordAux: string;

  loading: Loading;

  firedate = firebase.database().ref('/chat');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _auth: AngularFireAuth, private apiBlockChain: ApiClientService,
    public loadingCtrl: LoadingController,private alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.number = this.password = this.email = this.passwordAux = "";
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    this.lastName = this.navParams.get('lastName');
    this.date = this.navParams.get('date');
    this.country = this.navParams.get('country');
    console.log("Nombre: " + this.name + " Apellido: " + this.lastName + " Fecha: " + this.date + " Pais: " + this.country);
  }

  createAccount() {
    
    if (this.number == "" || this.email == "" || this.password == "" || this.passwordAux == "") {
      let error = "Todos los campos deben estar rellenos";
      this.showToast(error);
    } else if (this.password !== this.passwordAux) {
      let error = "Las contraseñas no coinciden"
      this.password = this.passwordAux = "";
      this.showToast(error);
    } else {
      this._auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(
        (res) => {
          this._auth.auth.currentUser.updateProfile({
            displayName: this.name + " " + this.lastName,
            photoURL: ''
          }).then((res) => {
            this.firedate.child(this._auth.auth.currentUser.uid).set({
              uid: this._auth.auth.currentUser.uid,
              displayName: this.name + " " + this.lastName,
              photoURL: ''
            }).then((res) => {
              var user={
                "$class": "org.transfer.tfg.CreateUser",
                "userId": this._auth.auth.currentUser.uid,
                "email": this.email,
                "name": this.name,
                "lastName": this.lastName,
                "date": this.date,
                "country": this.country,
                "phoneNumber": this.number
              }
              this.apiBlockChain.createUser(user).subscribe(
                result=>{
                  console.log(<any>result)
                  this.loading.dismiss()
                  this.navCtrl.setRoot(ProfileFotoPage);
                },
                error=>{
                  console.log(<any>error);
                  this.loading.dismiss();
                  this.showToast(error.body);
                });
            },
              (err) => {
                this.showToast(err.message);
                this.loading.dismiss()
                console.log(<any>err);
              })
          },
            (err) => {
              this.showToast(err.message);
              this.loading.dismiss()
              console.log(<any>err);
            });
        },
        (err) => {
          this.loading.dismiss()
          if (err.code == "auth/email-already-in-use") {
            let error = "Este correo ya esta registrado"
            this.showToast(error);
            this.password = this.passwordAux = this.email = "";
          } else if (err.code == "auth/invalid-email") {
            let error = "El formato del correo no es válido";
            this.showToast(error);
            this.email = this.password = this.passwordAux = "";
          } else if (err.code == "auth/weak-password") {
            let error = "La contraseña debe tener al menos 6 caracteres";
            this.showToast(error);
            this.password = this.passwordAux = "";
          }
          console.log(<any>err);
        });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  //Función para volver a la página de anterior
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
}
