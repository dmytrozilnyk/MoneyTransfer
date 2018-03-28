import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

@Injectable()
export class ChatProvider {
  fireFriendChats = firebase.database().ref('/friendchats');
  friend: any;
  friendMessages = [];
  constructor(public events: Events) {

  }

  initializebuddy(friend) {
    this.friend = friend;
  }

  addNewMessage(message) {
    if (this.friend) {
      var promise = new Promise((resolve, reject) => {
        this.fireFriendChats.child(firebase.auth().currentUser.uid).child(this.friend.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.fireFriendChats.child(this.friend.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          });
        })
      })
      return promise;
    }
  }

  getFriendMessages() {
    let aux;
    this.fireFriendChats.child(firebase.auth().currentUser.uid).child(this.friend.uid).on('value', (snapshot) => {
      this.friendMessages = [];
      aux = snapshot.val();
      for (var tempkey in aux) {
        this.friendMessages.push(aux[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

}
