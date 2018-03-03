import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { CreateAccountPage } from '../pages/register/create-account/create-account';
import { SetpasswordPage } from '../pages/setpassword/setpassword';
import { CardPage } from '../pages/tabs/card/card';
import { FriendsPage } from '../pages/tabs/friends/friends';
import { HomePage } from '../pages/tabs/home/home';
import { ProfilePage } from '../pages/tabs/profile/profile';
import { TransferPage } from '../pages/tabs/transfer/transfer';
import { ProfileFotoPage } from '../pages/register/profile-foto/profile-foto'

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { ApiClientService } from '../client/index';
import { config } from './app.firebaseconfig';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';

import { IonicStorageModule } from '@ionic/storage';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    RegisterPage,
    CreateAccountPage,
    SetpasswordPage,
    CardPage,
    FriendsPage,
    HomePage,
    ProfilePage,
    TransferPage,
    ProfileFotoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false,
      autoFocusAssist: false
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
      AngularFireModule.initializeApp(config),
      HttpClientModule,
      IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    RegisterPage,
    CreateAccountPage,
    SetpasswordPage,
    CardPage,
    FriendsPage,
    HomePage,
    ProfilePage,
    TransferPage,
    ProfileFotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    ApiClientService,
    FingerprintAIO,
    Camera,
    ImagePicker,
    Base64 
  ]
})
export class AppModule {}
