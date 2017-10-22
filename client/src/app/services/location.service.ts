import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class LocationService {

  options;
  domain = this.authService.domain;
  location;

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

  getAllLocations (){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'locations/allLocations', this.options).map(res => res.json());
  }

  getSingleLocation(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'locations/singleLocation/' + id, this.options).map(res => res.json());
  }

    editLocation(location){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'locations/updateLocation/' ,location, this.options).map(res => res.json());
  }

  deleteLocation(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'locations/deleteLocation/' + id, this.options).map(res => res.json());
  }
}
