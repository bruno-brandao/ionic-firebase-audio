import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Observable } from 'rxjs/Observable';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-my-files',
  templateUrl: 'my-files.html',
})
export class MyFilesPage {
  files: Observable<any[]>;
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;

  constructor(
    public navCtrl: NavController,
    private dataProvider: DataProvider,
    private alertCtrl: AlertController,
    private media: Media,
    private file: File,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    public platform: Platform) {
    this.files = this.dataProvider.getFiles();
  }

  addFile() {
    let inputAlert = this.alertCtrl.create({
      title: 'Store new information',
      inputs: [
        {
          name: 'info',
          placeholder: 'Lorem ipsum dolor...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Store',
          handler: data => {
            this.uploadInformation(data.info);
          }
        }
      ]
    });
    inputAlert.present();
  }

  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '');
    } else if (this.platform.is('android')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '');
    }
    this.audio = this.media.create(this.filePath + this.fileName);
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    this.recording = false;
    let audioFile;
    this.file.readAsDataURL(this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory, this.fileName).then((result) => {
      audioFile = result;
      this.uploadInformation(audioFile);
    }, (e) => {
      let toast = this.toastCtrl.create({
        message: 'Error ao salvar'+ JSON.stringify(e,null,2),
        duration: 3000
      });
      toast.present();
    });

  }

  playAudio(file, idx) {
    this.audio = this.media.create(file);
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  uploadInformation(file) {
    console.log(file);
    let upload = this.dataProvider.uploadToStorage(file);

    // Perhaps this syntax might change, it's no error here!
    upload.then().then(res => {
      this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
        let toast = this.toastCtrl.create({
          message: 'New File added!',
          duration: 3000
        });
        toast.present();
      });
    });
  }

  deleteFile(file) {
    this.dataProvider.deleteFile(file).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'File removed!',
        duration: 3000
      });
      toast.present();
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }
}