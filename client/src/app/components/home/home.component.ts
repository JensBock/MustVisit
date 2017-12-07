import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageSnackbarService } from '../../services/message-snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscription;

  constructor(
	public authService: AuthService,
	private messageSnackbarService: MessageSnackbarService
  ) { }

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
        }, 2000)
      } else {
        this.observeToken();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
