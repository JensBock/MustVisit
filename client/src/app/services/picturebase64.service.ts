import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class Picturebase64Service {

  constructor(
    private _DomSanitizationService: DomSanitizer
    ) { }

  getImageArrayBufferToBase64(pictureSrcString){
  return this._DomSanitizationService.bypassSecurityTrustUrl("data:image/jpg;base64," + String(this.arrayBufferToBase64(pictureSrcString)));
  }

  arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  getImage(pictureSrcString){
  return this._DomSanitizationService.bypassSecurityTrustUrl(pictureSrcString);
  }

}
