import { Component } from '@angular/core';
import * as _ from 'lodash';

export interface DesignType {
  value: string;
  viewValue: string;
}
export interface DoorCollection {
  value: string;
  viewValue: string;
  path: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  trappedBoxes = [];
  availableBoxes=['box1','box2'];
  foods: DesignType[] = [
    { value: 'door', viewValue: 'Door' },
    { value: 'window', viewValue: 'Window' },
  ];

  collectionData: any;
  imagepath: any;
  selected: any;
  doorboolean: boolean = false;
  door: DoorCollection[] = [
    { value: 'door1', viewValue: 'Door 1', path: '../assets/door/door1.jpg' },
    { value: 'door2', viewValue: 'Door 2', path: '../assets/door/door2.jpg' },
    { value: 'door3', viewValue: 'Door 3', path: '../assets/door/door3.jpg' },
    { value: 'door4', viewValue: 'Door 4', path: '../assets/door/door4.jpg' },

  ];

  window: DoorCollection[] = [
    { value: 'window1', viewValue: 'Window 1', path: '../assets/door/window1.jpg' },
    { value: 'window2', viewValue: 'Window 2', path: '../assets/door/window1.jpg' },
    { value: 'window3', viewValue: 'Window 3', path: '../assets/door/window1.jpg' },
    { value: 'window4', viewValue: 'Window 4', path: '../assets/door/window1.jpg' },

  ];

  typeChanged(event) {
    console.log("do something", event);
    if (event.value == 'door') {
      this.collectionData = this.door;
      console.log(this.collectionData);
      this.doorboolean=true;
    }
    else {
      this.collectionData = this.window;
      this.doorboolean=false;
    }
  }
  doorType(event) {
    _.map(this.door, value => {
      if (value['value'] == event.value) {
        this.imagepath = value['path'];
      }
    })
  }
  windowType(event){
    _.map(this.window, value => {
      if (value['value'] == event.value) {
        this.imagepath = value['path'];
      }
    })
  }
  boxSelect(event){
    console.log('event',event);
    this.trappedBoxes.push(event);
  }
}
