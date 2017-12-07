import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx'

@Injectable()
export class ProgressbarService {

  visible = false
  color = 'primary';
  mode = 'query';
  value = 100;
  bufferValue = 75;

  progessmodeSubject = new BehaviorSubject<boolean>(this.getVisible());

  constructor() { }

  enable(){
  this.visible = true;
  this.progessmodeSubject.next(this.visible);
  }

  disable(){
  this.visible = false;
  this.progessmodeSubject.next(this.visible);
  }

  getVisible(){
    return this.visible;
  }

  getMode() {
    return this.mode;
  }

  getColor() {
    return this.color;
  }

  getValue() {
    return this.value;
  }

  getBufferValue() {
    return this.bufferValue;
  }

  latestMode() : Observable<boolean> {
  return this.progessmodeSubject.asObservable().share();
  }

}
