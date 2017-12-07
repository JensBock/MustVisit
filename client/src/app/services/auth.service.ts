import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired,AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx'

@Injectable()
export class AuthService {

  domain = environment.domain;
  authToken;
  user;
  options;

  isLoginSubject = new BehaviorSubject<boolean>(this.loggedIn());

  constructor(
  private http: Http
  ) { 
  }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authToken
      })
    })
  }

  loadToken(){
  const token = localStorage.getItem('token');
  this.authToken = token;
  }

  registerUser(user) {
  	return this.http.post(this.domain + 'authentication/register', user).map(res => res.json());
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res.json());
  }

  login(user){
      return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
  }

  logout(){
    this.isLoginSubject.next(false);
    this.authToken = null;
    this.user = null
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user
    this.isLoginSubject.next(true);
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res => res.json());
  }

  loggedIn() {
    let value = false
    if (localStorage.getItem('token') !==''){
    value = tokenNotExpired();
    }
    return value;
  }

  isLoggedIn() : Observable<boolean> {
  return this.isLoginSubject.asObservable().share();
  }

  loggedIntokenNotExpired() {
    if (this.loggedIn() == false ){
    this.isLoginSubject.next(false);
    }
    return this.loggedIn();
  }

}
