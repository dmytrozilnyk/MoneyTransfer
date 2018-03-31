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
import { FindFriendsPage } from '../pages/tabs/friends/find-friends/find-friends';
import { HomePage } from '../pages/tabs/home/home';
import { ProfilePage } from '../pages/tabs/profile/profile';
import { TransferPage } from '../pages/tabs/transfer/transfer';
import { ProfileFotoPage } from '../pages/register/profile-foto/profile-foto'
import { SettingPage } from '../pages/tabs/profile/setting/setting';
import { DetailsPage } from '../pages/tabs/home/details/details';
import { ChatPage } from './../pages/tabs/friends/chat/chat';
import { QrPage } from '../pages/tabs/friends/find-friends/qr/qr';
import { AddCardPage } from '../pages/tabs/card/add-card/add-card';
import { WithdrawPage } from '../pages/tabs/transfer/withdraw/withdraw';
import { SentPage } from './../pages/tabs/transfer/sent/sent';
import { RequestPage } from '../pages/tabs/transfer/request/request';
import { DepositPage } from '../pages/tabs/transfer/deposit/deposit';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { ApiClientService } from '../client/index';
import { config } from './app.firebaseconfig';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';

import { RequestsProvider } from '../providers/requests/requests';
import { UserProvider } from '../providers/user/user';
import { ChatProvider } from '../providers/chat/chat';


@NgModule({
  declarations: [
    MyApp,
    /*LoginPage,
    TabsPage,
    RegisterPage,
    CreateAccountPage,
    SetpasswordPage,
    CardPage,
    FriendsPage,
    FindFriendsPage,
    ChatPage,
    HomePage,
    ProfilePage,
    TransferPage,
    ProfileFotoPage,
    SettingPage,
    DetailsPage,
    QrPage,
    AddCardPage,
    WithdrawPage,
    SentPage,
    RequestPage,
    DepositPage*/
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false,
      autoFocusAssist: false
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
    FindFriendsPage,
    ChatPage,
    HomePage,
    ProfilePage,
    TransferPage,
    ProfileFotoPage,
    SettingPage,
    DetailsPage,
    QrPage,
    AddCardPage,
    WithdrawPage,
    SentPage,
    RequestPage,
    DepositPage
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
    Base64,
    RequestsProvider,
    UserProvider,
    ChatProvider ,
    NativePageTransitions
  ]
})
export class AppModule {}
