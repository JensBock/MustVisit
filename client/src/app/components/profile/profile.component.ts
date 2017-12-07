import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MessageSnackbarComponent } from '../message-snackbar/message-snackbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

	username ='';
	email ='';
  subscription;

  	constructor(
		private authService: AuthService,
    private snackBar: MatSnackBar,
    private locationAng: Location,
    private router: Router
  	) {

    }

 observeToken(){
  if (this.authService !== undefined){
      this.subscription = this.authService.isLoggedIn().subscribe (authData => {
        if (authData == false){
          this.subscription.unsubscribe();
  /** if no TimeOut ERROR Error: ExpressionChangedAfterItHasBeenCheckedError */
          setTimeout(() => {
            this.snackBar.openFromComponent(MessageSnackbarComponent,{ data: 'Token expired', duration: 6000});
          }, 1000)
        }
      })
    }
  }

  ngOnInit() {
     this.subscription = this.authService.getProfile().subscribe( profile => {
        if (!profile.success){
          this.snackBar.openFromComponent(MessageSnackbarComponent,{ data: profile.message, duration: 6000});
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000)
        } else {
          this.username = profile.user.username;
          this.email = profile.user.email;
          this.observeToken();
        }
      });
  	}

    ngOnDestroy() {
    this.subscription.unsubscribe();
    }

}
