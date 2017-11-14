import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  username;
  locations;
  currentId;

  mapHeight;
  tags;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
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

  onClick(event,id){
    if(this.currentId == id){
      this.currentId = null;
    } else {
      this.currentId = id;
      setTimeout(() =>{
      let el = document.getElementById(id);
      let ell = <HTMLElement> el.children[0];
      this.mapHeight = ell.offsetHeight;
      el.scrollIntoView({behavior: "smooth"});
      },100)
    }
  
  }


  getAllLocations(){
    this.locationService.getAllLocations().subscribe(data => {
      this.locations = data.locations;
    });
  }

  getAllLocationsAndPictures(){
    this.locationService.getAllLocationsAndPicture().subscribe(data => {
      this.locations = data.locations;
      for (let int in this.locations){
      this.locations[int].src = this.getImageArrayBufferToBase64(this.locations[int].picture.img.data)
      ;
      }
    });
  }

  ngOnInit() {
    this.tags = ["tag1","tag2"];
    this.authService.getProfile().subscribe( profile => {
      this.username = profile.user.username;
    });
    this.getAllLocationsAndPictures();
    }
}
