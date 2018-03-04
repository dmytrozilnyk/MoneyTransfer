import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from './home/home';
import { FriendsPage } from './friends/friends';
import { TransferPage } from './transfer/transfer';
import { CardPage } from './card/card';
import { ProfilePage } from './profile/profile';
import { Events } from 'ionic-angular';
import { SettingPage } from './profile/setting/setting';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = FriendsPage;
  tab3Root: any = TransferPage;
  tab4Root: any = CardPage;
  tab5Root: any = ProfilePage;

  paginasAux:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events) {
    this.paginasAux=true;
  }

  ionViewDidLoad() {
    this.events.subscribe('logout', () => {
      this.logout();
    });
  }

  logout(){
    this.navCtrl.setRoot(LoginPage);
  }

}
