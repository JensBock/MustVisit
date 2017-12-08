import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { ProgressbarService } from '../../../services/progressbar.service';
import { MessageSnackbarService } from '../../../services/message-snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-location',
  templateUrl: './delete-location.component.html',
  styleUrls: ['./delete-location.component.css']
})
export class DeleteLocationComponent implements OnInit, OnDestroy {

  subscription;
  foundLocation = false;
  processing = false;
  location;
  currentUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private locationService: LocationService,
    private progressbarService: ProgressbarService,
    private messageSnackbarService: MessageSnackbarService

  ) { }

  deleteLocation() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.locationService.deleteLocation(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.removePicture(this.location.picture._id)
        setTimeout(() => {
          this.router.navigate(['/locations']);
        }, 1000);
      }
    });
  }

  removePicture(originalPictureId) {
    this.locationService.deletePicture(originalPictureId).subscribe(data => {
      if(!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
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
    this.progressbarService.enable();
    this.subscription = this.authService.getProfile().subscribe( profile => {
      if (!profile.success){
        this.messageSnackbarService.open({ data: profile.message, duration: 6000});
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000)
      } else {
          this.currentUrl = this.activatedRoute.snapshot.params;
          this.locationService.getSingleLocation(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.messageSnackbarService.open({ data: data.message, duration: 6000});
            this.router.navigate(['/locations']);
            this.progressbarService.disable();
          } else {
            if (profile.user.username && data.location[0].createdBy){
               if (profile.user.username === data.location[0].createdBy){
                  this.location = data.location[0];
                  this.foundLocation = true;
                  this.progressbarService.disable();
                  this.observeToken();
                } else {
                  this.messageSnackbarService.open({ data: 'You can not edit this location', duration: 6000});
                  this.router.navigate(['/locations']);
                }
            } else {
              this.messageSnackbarService.open({ data: 'You can not edit this location', duration: 6000});
              this.router.navigate(['/locations']);
              this.progressbarService.disable();
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
