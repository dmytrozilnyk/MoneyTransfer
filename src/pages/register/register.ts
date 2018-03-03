import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CreateAccountPage } from './create-account/create-account';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  date:Date;
  country:string;
  name:string;
  lastName:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController) {
    this.country=this.lastName=this.name="";
    this.date=null;
  }

  ionViewDidLoad() {}

  //Función para volver a la página de inicio
  goBack(){
    this.navCtrl.pop();
  }

  //Función para seguir con el registro
  goNext(){
    if(this.date==null ||  this.name=="" || this.lastName=="" || this.country==""){
      let error="Todos los campos deben estar rellenos";
      this.showToast(error);
    }else{
      this.navCtrl.push(CreateAccountPage,{
        name: this.name,
        lastName: this.lastName,
        date:this.date,
        country:this.country
      });
    }
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
