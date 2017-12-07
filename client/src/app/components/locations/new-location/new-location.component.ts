import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { Picturebase64Service } from '../../../services/picturebase64.service';
import { ValidateService } from '../../../services/validate.service';
import { ProgressbarService } from '../../../services/progressbar.service';
import { MessageSnackbarService } from '../../../services/message-snackbar.service';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.css']
})
export class NewLocationComponent implements OnInit, OnDestroy {

  form;
  subscription;

  newLocation = false;
  processing = false;

  dataActive = true;
  pictureActive = false;
  mapActive = false;

  username;
  locations;
  lat: number ;
  lng: number ;
  tags=[];
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
    private picturebase64Service: Picturebase64Service,
    private progressbarService: ProgressbarService,
    private messageSnackbarService: MessageSnackbarService,
    private router: Router
    ) 
    { 
	   this.createNewLocationForm();
    }

   createNewLocationForm(){
    this.form = this.formBuilder.group({
      title: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        ValidateService.alphaNumericValidation
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
        this.checkTagIsInArrayValidation.bind(this)
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
        this.messageSnackbarService.open({ data: ext + ' is a valid picture format', duration: 6000});
        pictureSrcString = this.pictureLoader(this.file);
        this.pictureIsValid = true;
      } else {        
        this.messageSnackbarService.open({ data: ext + ' is not valid picture format select one of following extensions (JPG, JPEG)', duration: 6000});
        this.pictureIsValid = false;
      }
    }
  }

  pictureLoader(file){
    this.progressbarService.enable();
    let pictureSrcString
    let reader = new FileReader();
        reader.onloadend = (e) => {
          pictureSrcString = reader.result;
          this.pictureSrc = this.picturebase64Service.getImage(pictureSrcString );
          this.progressbarService.disable();
        }
        reader.readAsDataURL(file);
  }

  onLocationSubmit() {
    this.progressbarService.enable();
    if (this.pictureIsValid){
    this.uploadAndGetPictureId()
    }
  }

  uploadAndGetPictureId() {
      this.processing = true;
      this.newLocation = true;
      this.disableNewLocationForm();
      this.formData = new FormData();
      this.formData.append('picture', this.file, this.file.name);
      this.locationService.newPicture(this.formData).subscribe(data => {
      if(!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        this.progressbarService.disable();
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
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
      tags: this.tags,
      createdBy: this.username,
      picture: pictureId
      }

      if (location.picture !== null){

        this.locationService.newLocation(location).subscribe(data => {
          if(!data.success) {
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
            this.processing = false;
            this.enableNewLocationForm();
          } else {
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
            setTimeout(() =>{
              this.newLocation = false;
              this.processing = false;
              this.form.reset();
              this.enableNewLocationForm();
              this.progressbarService.disable();
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
            },
            error => {
              switch (error.code) {
                  case 1:
                      console.log('Permission Denied');
                      this.messageSnackbarService.open({ data: 'Permission Geolocation Denied', duration: 6000});
                      break;
                  case 2:
                      console.log('Position Unavailable');
                      this.messageSnackbarService.open({ data: 'Permission Geolocation Unavailable', duration: 6000});
                      break;
                  case 3:
                      console.log('Timeout');
                      this.messageSnackbarService.open({ data: 'Permission Geolocation Timeout', duration: 6000});
                      break;
              }
            }
        );
    } else { 
      this.messageSnackbarService.open({ data: 'Geolocation is not supported by this browser.', duration: 6000});
    }
  }

  mapClicked($event){
    if ($event.coords.lat && $event.coords.lng) {
        this.lat = $event.coords.lat
        this.lng = $event.coords.lng
    }
  }

  checkTagIsInArrayValidation(controls){
    let res = null
     this.tags.forEach( (item, index) => {
     if(item === controls.value) {
        res = {'checkTagIsInArrayValidation': true};
        return res;
      }});
      return res;
  }

  addTag(){
    let tag = this.form.get('tag').value
    this.tags.push(tag);
    this.form.get('tag').setValue('');
  }

  removeTag(tag){
   this.tags.forEach( (item, index) => {
     if(item === tag) this.tags.splice(index,1);
   });
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

 observeToken(){
  if (this.authService !== undefined){
      this.subscription = this.authService.isLoggedIn().subscribe (authData => {
        if (authData == false){
          this.subscription.unsubscribe();
          this.messageSnackbarService.open({ data: 'Token expired', duration: 6000});
        }
      })
    }
  }

  ngOnInit() {
    this.subscription = this.authService.getProfile().subscribe( profile => {
      if (!profile.success){
        this.messageSnackbarService.open({ data: profile.message, duration: 6000});
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000)
      } else {
        this.username = profile.user.username;
        this.addLocation();
        this.observeToken();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
