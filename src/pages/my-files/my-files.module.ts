import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFilesPage } from './my-files';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyFilesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyFilesPage),
  ],
  providers: [
    InAppBrowser
  ]
})
export class MyFilesPageModule {}
