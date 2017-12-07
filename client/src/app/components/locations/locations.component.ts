import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageSnackbarService } from '../../services/message-snackbar.service';
import { LocationService } from '../../services/location.service';
import { Picturebase64Service } from '../../services/picturebase64.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PopupLocationComponent } from '../popup-location/popup-location.component';
import { ProgressbarService } from '../../services/progressbar.service';
import { MessageSnackbarComponent } from '../message-snackbar/message-snackbar.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit, OnDestroy {

  popupLocationDialogRef: MatDialogRef<PopupLocationComponent>;

  username;
  locations;
  subscription;

  processing = false;

  form;
  formData: FormData;

  mapHeight;
  searchTags = [];

  constructor(
    private authService: AuthService,
    private messageSnackbarService: MessageSnackbarService,
    private router: Router,
    private locationService: LocationService,
    private picturebase64Service: Picturebase64Service,
    private progressbarService: ProgressbarService,
    private dialog: MatDialog
  ) { 
  }

  openDialog(id) {
    this.popupLocationDialogRef = this.dialog.open(PopupLocationComponent , {
      hasBackdrop: true,
      maxHeight:"95vh",
      data: {
        id: id
      }
    });
  }

  onClick(event,id){
   this.openDialog(id);
  }

  receiveTags($event){
    this.searchTags = $event;
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
        this.locations[int].src = this.picturebase64Service.getImageArrayBufferToBase64(this.locations[int].picture.img.data);
        this.progressbarService.disable()
      }
    });
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
    this.progressbarService.enable()
    this.subscription = this.authService.getProfile().subscribe( profile => {
      if (!profile.success){
        this.messageSnackbarService.open({ data: profile.message, duration: 6000});
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000)
      } else {
        this.username = profile.user.username;
        this.getAllLocationsAndPictures();
        this.observeToken();
      }
    });
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
}
