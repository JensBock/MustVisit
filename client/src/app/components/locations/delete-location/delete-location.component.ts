import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
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
    private messageSnackbarService: MessageSnackbarService

  ) { }

  deleteLocation() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.locationService.deleteLocation(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
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
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.locationService.getSingleLocation(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
         setTimeout(() => {
          this.router.navigate(['/locations']);
        }, 1000);
      } else {
        this.location = data.location[0];
        this.foundLocation = true;
        this.observeToken();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
