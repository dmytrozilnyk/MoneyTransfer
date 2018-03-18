import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Loading, LoadingController, App } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Platform, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ApiClientService } from '../../../client';
import { Base64 } from '@ionic-native/base64';
import { SettingPage } from './setting/setting';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  showInformation: boolean;
  image: string = "noImage";
  name:string;
  lastName:string;
  date:string;
  email:string;
  country:string;
  phoneNumber:string

  isRead:boolean;

  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private imagePicker: ImagePicker,
    public actionsheetCtrl: ActionSheetController, public platform: Platform,
    public events: Events,private _auth: AngularFireAuth,private apiBlockChain: ApiClientService,
    private base64: Base64,public loadingCtrl: LoadingController,public app: App) {
      this.showInformation=false;
      this.isRead=false;
  }

  ionViewDidLoad() {
    var loading = this.loadingCtrl.create();
    loading.present();
    this.apiBlockChain.getUserId(this._auth.auth.currentUser.uid).subscribe(
      result=>{
        console.log(result)
        let user = result.body
        this.name=user.name;
        this.lastName=user.lastName;
        this.date=user.date;
        this.email=user.email;
        this.country= user.country;
        this.phoneNumber= user.phoneNumber;
        this.image= user.image;
        this.showInformation=true;
        loading.dismiss();
      },
      error=>{
        console.log(error)
        this.showInformation=true;
        loading.dismiss();
      });
  }

  changeInfo(){
    this.isRead=true;
  }

  acceptInfo(){
    this.isRead=false;
  }

  cancelInfo(){
    this.isRead=false;
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
        console.log('Image of the camera: ' + imageData)
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
        this.image = results;
        this.base64.encodeFile(results).then((base64File: string) => {
         console.log("Start:::: " + base64File + "::::End");
        }, (err) => {
          console.log(err);
        });
    }, (err) => { 
      console.log(<any>err)
    });
  }

  goSetting(){
    this.app.getRootNav().push(SettingPage);
  }

  logout(){
    this._auth.auth.signOut().then(result=>{
      console.log(result);
      this.events.publish('logout','true');
    },
    error=>{
      console.log(error);
    })
   
  }

}
