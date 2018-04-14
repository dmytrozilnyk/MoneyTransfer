import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Loading, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Platform, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ApiClientService } from '../../../client';
import { Base64 } from '@ionic-native/base64';
import { TabsPage } from '../../tabs/tabs';


@IonicPage()
@Component({
  selector: 'page-profile-foto',
  templateUrl: 'profile-foto.html',
})
export class ProfileFotoPage {

  image:string=null;
  image64:string="noImage";

  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private imagePicker: ImagePicker,
    public actionsheetCtrl: ActionSheetController, public platform: Platform,
    public events: Events,private _auth: AngularFireAuth,private apiBlockChain: ApiClientService,
    private base64: Base64, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileFotoPage');
  }

  changeFoto(){
    /*let foto = {
      "$class": "org.transfer.tfg.AddProfileFoto",
      "user": "resource:org.transfer.tfg.User#"+ this._auth.auth.currentUser.uid,
      "image": this.image64
    }
    this.apiBlockChain.addProfileFoto(foto).subscribe(
      result=>{
        console.log(result);
        this.loading.dismiss()
        this.navCtrl.setRoot(TabsPage);
      },
      error=>{
        this.loading.dismiss()
        console.log(error);
      });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();*/
      this.navCtrl.setRoot(TabsPage);
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Cambiar foto',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Hacer una foto',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Escoger de la galeria',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            this.selectPhoto();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      cameraDirection: 1,
      correctOrientation: true,
    };

    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
        this.image64=this.image;
      })
      .catch(error => {
        console.error(error);
      });
  }

  selectPhoto() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
        this.base64.encodeFile(results).then((base64File: string) => {
          this.image=base64File;
          this.image64=base64File;
        }, (err) => {
          console.log(err);
        });
    }, (err) => { 
      console.log(<any>err)
    });
  }

}
