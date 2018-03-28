
import { Injectable } from '@angular/core';
import { ConnRequest } from '../../models/interface/request';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
import { UserProvider } from '../user/user';

@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  firedata = firebase.database().ref('/chat');
  firefriends = firebase.database().ref('/friends');

  userDetails;
  myfriends;
  constructor(public events: Events, public userService: UserProvider) {

  }

  sendrequest(req: ConnRequest) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(req.recipient).push({
        sender: req.sender
      }).then(() => {
        resolve({ success: true });
      })
    })
    return promise;
  }


  getFriends() {
    let friendsUid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allFriends = snapshot.val();
      this.myfriends = [];
      for (var i in allFriends)
        friendsUid.push(allFriends[i].uid);
      this.userService.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsUid)
          for (var key in users) {
            if (friendsUid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      });
    });
  }

  getRequests() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.userService.getallusers().then((res) => {
        var allUsers = res;
        this.userDetails = [];
        for (var i in myrequests)
          for (var user in allUsers) {
            if (myrequests[i] === allUsers[user].uid) {
              this.userDetails.push(allUsers[user]);
            }
          }
        this.events.publish('gotRequests');
      });
    });
  }

  acceptRequest(friend) {
    var myfriends = [];
    var promise = new Promise((resolve, reject) => {
      this.firefriends.child(firebase.auth().currentUser.uid).push({
        uid: friend.uid
      }).then(() => {
        this.firefriends.child(friend.uid).push({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleteRequest(friend).then(() => {
            resolve(true);
          });
        });
      });
    });
    return promise;
  }

  deleteRequest(friend) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(friend.uid).once('value', (snapshot) => {
        let somekey;
        for (var key in snapshot.val())
          somekey = key;
        this.firereq.child(firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
          resolve(true);
        })
      })
        .then(() => {

        }).catch((err) => {
          reject(err);
        });
    });
    return promise;
  }
}