import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageSnackbarService } from '../../services/message-snackbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
  	public authService: AuthService,
  	private router: Router,
    private messageSnackbarService: MessageSnackbarService
  ) { }

  onLogoutClick() {
  	this.authService.logout();
    this.messageSnackbarService.open({ data: 'You are logged out', duration: 6000});
  	this.router.navigate(['/'])
  }

}
