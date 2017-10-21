import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class LocationService {

  options;
  domain = this.authService.domain;

  constructor(
  	private authService: AuthService,
  	private http: Http
  ) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authService.authToken
      })
    })
  }

  newLocation(location) {
  	this.createAuthenticationHeaders();
  	return this.http.post(this.domain + 'locations/newLocation', location, this.options).map(res => res.json());
  }
}
