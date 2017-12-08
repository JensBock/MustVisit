import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { Picturebase64Service } from '../../../services/picturebase64.service';
import { ValidateService } from '../../../services/validate.service';
import { ProgressbarService } from '../../../services/progressbar.service';
import { MessageSnackbarService } from '../../../services/message-snackbar.service';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit, OnDestroy {

  subscription;
	location;
  tags=[];
	processing = false;
	currentUrl;
	loading = true;
  form;
  lat: number ;
  lng: number ;
  pictureIsValid = true;
  originalPictureId;
  newPicture = false;

  dataActive = true;
  pictureActive = false;
  mapActive = false;

  pictureSrc;

  formData: FormData;
  file : File;

  	constructor(
    private router: Router,
    private formBuilder: FormBuilder,
		private locationAng: Location,
		private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private locationService: LocationService,
    private picturebase64Service: Picturebase64Service,
    private progressbarService: ProgressbarService,
    private messageSnackbarService: MessageSnackbarService
  	) { 
    
    }

    createEditLocationForm(){
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

  checkTagIsInArrayValidation(controls){
    let res = null;
    if (this.location){
      this.location.tags.forEach( (item, index) => {
        if(item === controls.value) {
          res = {'checkTagIsInArrayValidation': true};
          return res;
        }}
        );
      return res;
    }
  }

  fileChange(event) {
    this.progressbarService.enable();
    let validFormats = ['jpg', 'jpeg'];
    let ext = "";
    let fileList: FileList = event.target.files;
    let pictureSrcString
    this.newPicture =  true;
    
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
      this.progressbarService.disable();
    }
  }

  pictureLoader(file){
    let pictureSrcString
    let reader = new FileReader();
        reader.onloadend = (e) => {
          pictureSrcString = reader.result;
          this.pictureSrc = this.picturebase64Service.getImage(pictureSrcString );
        }
        reader.readAsDataURL(file);
  }

  onLocationSubmit() {
    this.progressbarService.enable();
    if (this.pictureIsValid && this.newPicture ){
      this.removePicture(this.originalPictureId);
    } else {
      this.updateLocationSubmit(this.originalPictureId);
    }
  }

  removePicture(originalPictureId) {
      this.locationService.deletePicture(originalPictureId).subscribe(data => {
      if(!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        this.uploadAndGetPictureId()
      }
    });
  }

  uploadAndGetPictureId() {
      this.processing = true;
      this.disableEditLocationForm();
      this.formData = new FormData();
      this.formData.append('picture', this.file, this.file.name);
      this.locationService.newPicture(this.formData).subscribe(data => {
      if(!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        this.updateLocationSubmit(data.picture._id)
      }
    });
  }

  updateLocationSubmit(pictureId){

      this.location.title = this.form.get('title').value;
      this.location.body = this.form.get('body').value;
      this.location.lat = this.location.lat;
      this.location.lng = this.location.lng;
      this.location.tags = this.location.tags;
      this.location.picture = pictureId;

      if (this.location.picture !== null){

        this.locationService.editLocation(this.location).subscribe(data => {
          if(!data.success) {
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
            this.processing = false;
            this.enableEditLocationForm();
            this.progressbarService.disable();
          } else {
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
            setTimeout(() =>{
              this.processing = false;
              this.form.reset();
              this.enableEditLocationForm();
              this.progressbarService.disable();
            },2000)
            setTimeout(() => {
            this.router.navigate(['/locations']);
            },2000);
          }
        });
      }
  }

  enableEditLocationForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableEditLocationForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  goBack() {
  	this.locationAng.back()
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

  addTag(){
    let tag = this.form.get('tag').value
    this.location.tags.push(tag);
    this.form.get('tag').setValue('');
  }

  removeTag(tag){
   this.location.tags.forEach( (item, index) => {
     if(item === tag) this.location.tags.splice(index,1);
   });
  }

  addLocation() {
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                    this.location.lat = position.coords.latitude,
                    this.location.lng = position.coords.longitude
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        break;
                    case 3:
                        console.log('Timeout');
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
        this.location.lat = $event.coords.lat
        this.location.lng = $event.coords.lng
    }
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
  this.progressbarService.enable();
    this.subscription = this.authService.getProfile().subscribe( profile => {
      if (!profile.success){
        this.messageSnackbarService.open({ data: profile.message, duration: 6000});
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000)
      } else {
        this.activatedRoute.params
        .switchMap((params) => this.locationService.getSingleLocation(params['id']))
        .subscribe(data => {
          if (!data.success){
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
             setTimeout(() => {
              this.router.navigate(['/locations']);
            }, 1000);
            this.progressbarService.disable();
          } else {
            if (profile.user.username && data.location[0].createdBy){
               if (profile.user.username === data.location[0].createdBy){
                  this.location = data.location[0];
                  this.createEditLocationForm();
                  this.form.controls['title'].setValue(this.location.title);
                  this.form.controls['body'].setValue(this.location.body);
                  this.pictureSrc = this.picturebase64Service.getImageArrayBufferToBase64(this.location.picture.img.data);
                  this.originalPictureId = this.location.picture._id
                  this.loading = false;
                  this.progressbarService.disable();
                  this.observeToken();
                } else {
                  this.messageSnackbarService.open({ data: 'You can not edit this location', duration: 6000});
                  this.router.navigate(['/locations']);
                }
            } else {
              this.messageSnackbarService.open({ data: 'You can not edit this location', duration: 6000});
              this.router.navigate(['/locations']);
            }
          } 
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
