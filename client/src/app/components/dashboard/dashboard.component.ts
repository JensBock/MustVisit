import { Component, OnInit , OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { ProgressbarService } from '../../services/progressbar.service';
import { MessageSnackbarService } from '../../services/message-snackbar.service';

import { GmapComponent } from '../gmap/gmap.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy {

  @ViewChild(GmapComponent)
  private gmapComponent: GmapComponent;

  subscription;
  locations;
  user;

  constructor(
    private router: Router,
    private authService: AuthService,
    private locationService: LocationService,
    private progressbarService: ProgressbarService,
    private messageSnackbarService: MessageSnackbarService
    ) 

    { 
    
    }

  getAllLocations(){
    this.locationService.getAllLocations().subscribe(data => {
      this.locations = data.locations;
      this.gmapComponent.setMapLoad(this.locations, this.user.username);
  });
  }

  ngAfterViewInit() {
    this.progressbarService.enable()
    this.subscription = this.authService.getProfile().subscribe( profile => {
      if (!profile.success){
        this.messageSnackbarService.open({ data: profile.message, duration: 6000});
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000)
      } else {
        this.user = profile.user
        this.getAllLocations();
        this.observeToken();
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

    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressbarService.disable();
  }

}