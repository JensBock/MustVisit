import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageSnackbarService } from '../../services/message-snackbar.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	processing = false;
	form;
  previousUrl;

  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageSnackbarService: MessageSnackbarService,
    private router: Router,
    private authGuard: AuthGuard

  ) { 
  	this.createForm();
  }

  createForm() {
  	this.form = this.formBuilder.group({
  		username: ['', Validators.required],
  		password: ['', Validators.required]
  	});
  }

  disableForm() {
  	this.form.controls['username'].disable();
  	this.form.controls['password'].disable();
  }

  enableForm() {
    this.form.controls['username'].enable();
  	this.form.controls['password'].enable();
  }

  onLoginSubmit() {
  	this.processing = true;
  	this.disableForm();
  	const user = {
  		username: this.form.get('username').value,
  		password: this.form.get('password').value
  	}

    this.authService.login(user).subscribe(data => {
      if(!data.success){
        this.processing = false;
        this.enableForm();
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
      } else {
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        this.authService.storeUserData(data.token, data.user)
        this.disableForm();
        setTimeout(() => {
          if (this.previousUrl){
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 2000)
      }
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageSnackbarService.open({ data: 'You must be logged in to view that page.', duration: 6000});
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}


