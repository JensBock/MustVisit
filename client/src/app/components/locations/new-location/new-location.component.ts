import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {  Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.css']
})
export class NewLocationComponent implements OnInit {

  messageClass;
  message;

  form;

  newLocation = false;
  processing = false;

  dataActive = true;
  pictureActive = false;
  mapActive = false;

  username;
  locations;
  lat: number ;
  lng: number ;
  tags;
  picture;
  pictureId;
  pictureIsValid= false;
  pictureSrc;
  formData: FormData;
  file : File;

  constructor(
    private locationAng: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private _DomSanitizationService: DomSanitizer,
    private router: Router
    ) { 
	this.createNewLocationForm();
    }

   createNewLocationForm(){
    this.form = this.formBuilder.group({
      title: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
      ])],
      tag: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(3),
      ])]
    })
  }

  enableNewLocationForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewLocationForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)) {
      return null
    } else {
      return {'alphaNumericValidation': true}
    }
  };

  newLocationForm() {
    this.newLocation = true; // Show new blog form
  }

  fileChange(event) {
    let validFormats = ['jpg', 'jpeg'];
    let ext = "";
    let fileList: FileList = event.target.files;
    let pictureSrcString
    
    if (fileList.length > 0) {
      this.file = fileList[0];
      ext = this.file.name.substring(this.file.name.lastIndexOf('.') + 1).toLowerCase();   
      if (validFormats.indexOf(ext) > -1) {
        this.messageClass = 'alert alert-success';
        this.message = ext + " is a valid picture format";
        pictureSrcString = this.pictureLoader(this.file);
        this.pictureIsValid = true;
      } else {        
        this.messageClass = 'alert alert-danger';
        this.message = ext + " is not valid picture format select one of following extensions (JPG, JPEG)";
        this.pictureIsValid = false;
      }
    }
  }

  setImage(pictureSrcString){
  this.pictureSrc = this._DomSanitizationService.bypassSecurityTrustUrl(pictureSrcString);
  }

  pictureLoader(file){
    let pictureSrcString
    let reader = new FileReader();
        reader.onloadend = (e) => {
          pictureSrcString = reader.result;
          this.setImage(pictureSrcString );
        }
        reader.readAsDataURL(file);
  }

  uploadPicture(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.formData = new FormData();
      this.formData.append('picture', this.file, this.file.name);
      this.locationService.newPicture(this.formData).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.pictureId = data.picture._id;
        this.locationService.getSinglePicture(this.pictureId).subscribe(data => {
          this.pictureSrc = this._DomSanitizationService.bypassSecurityTrustUrl("data:image/jpg;base64," + String(this.arrayBufferToBase64(data.picture[0].img.data)));
        });
      }
    });
    }
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


  onLocationSubmit() {
    if (this.pictureIsValid){
    this.uploadAndGetPictureId()
    }
  }

  uploadAndGetPictureId() {
      this.newLocation = true;
      this.disableNewLocationForm();
      this.formData = new FormData();
      this.formData.append('picture', this.file, this.file.name);
      this.locationService.newPicture(this.formData).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.newLocationSubmit(data.picture._id)
      }
    });
  }

  newLocationSubmit(pictureId){
      const location = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      lat: this.lat,
      lng: this.lng,
      createdBy: this.username,
      picture: pictureId
      }

      if (location.picture !== null){

        this.locationService.newLocation(location).subscribe(data => {
          if(!data.success) {
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
            this.processing = false;
            this.enableNewLocationForm();
          } else {
            this.messageClass = 'alert alert-success';
            this.message = data.message;
            setTimeout(() =>{
              this.newLocation = false;
              this.processing = false;
              this.message = false;
              this.form.reset();
              this.enableNewLocationForm();
            },2000)
            setTimeout(() => {
            this.router.navigate(['/locations']);
            },2000);
          }
        });
      }
  }

  goBack() {
    this.locationAng.back()
  }

  addLocation() {
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                    this.lat = position.coords.latitude,
                    this.lng = position.coords.longitude
                    this.messageClass = null;
                    this.message = null;
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Denied";
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Unavailable";
                        break;
                    case 3:
                        console.log('Timeout');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Timeout";
                        break;
                }
            }
        );
    } else { 
        this.messageClass = 'alert alert-success';
        this.message = 'Geolocation is not supported by this browser.';
    }
  }

  mapClicked($event){
    if ($event.coords.lat && $event.coords.lng) {
        this.lat = $event.coords.lat
        this.lng = $event.coords.lng
    }
  }

  addTag(){
    this.tags.push(this.form.get('tag').value);
    this.form.get('tag').setValue('');
  }

  setDataTab(){
    this.dataActive = true;
    this.pictureActive = false;
    this.mapActive = false;
  }

  setPictureTab(){
    this.dataActive = false;
    this.pictureActive = true;
    this.mapActive = false;
  }

  setMapTab(){
    this.dataActive = false;
    this.pictureActive = false;
    this.mapActive = true;
  }

  ngOnInit() {
    this.tags = ["tag1","tag2"];
    this.authService.getProfile().subscribe( profile => {
      this.username = profile.user.username;
    });
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                    this.lat = position.coords.latitude,
                    this.lng = position.coords.longitude
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Denied";
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Unavailable";
                        break;
                    case 3:
                        console.log('Timeout');
                        this.messageClass = 'alert alert-danger';
                        this.message = "Permission Geolocation Timeout";
                        break;
                }
            }
        );
    }
  }

}
