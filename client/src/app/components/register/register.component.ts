import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { MessageSnackbarService } from '../../services/message-snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private messageSnackbarService: MessageSnackbarService,
  private router: Router
  ) { 
	this.createForm()
  }

  createForm() {
    this.form = this.formBuilder.group({
    email: ['',Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      ValidateService.validateEmail
      ])],
    username: ['',Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      ValidateService.validateUsername
      ])],
    password: ['',Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(35),
      ValidateService.validatePassword
    ])],
    confirm: ['',Validators.required]
    }, {validator: ValidateService.matchingPasswords('password','confirm')});
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }


  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  onRegisterSubmit(){
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success){
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        this.processing = false;
        this.enableForm();
      } else {
        this.disableForm();
        this.messageSnackbarService.open({ data: data.message, duration: 6000});
        setTimeout(() => {
            this.router.navigate(['/dashboard']);
        }, 2000)
      }
    });
  }

  checkEmail(){
    const email = this.form.get('email').value;
    this.authService.checkEmail(email).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    }); 
  }

  checkUsername(){
    const username = this.form.get('username').value;
    this.authService.checkUsername(username).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    }); 
  }

  ngOnInit() {
  }

}
