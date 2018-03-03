import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { HomePage } from './home/home';
import { FriendsPage } from './friends/friends';
import { TransferPage } from './transfer/transfer';
import { CardPage } from './card/card';
import { ProfilePage } from './profile/profile';
import { Events } from 'ionic-angular';


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

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";
  tab5Title = " ";

  constructor(public navCtrl: NavController, public navParams: NavParams, public translateService: TranslateService,public events: Events) {
    /*translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
    });*/
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
