import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit {

	message;
	messageClass;
	location;
	processing = false;
	currentUrl;
	loading = true;

  	constructor(
		private locationAng: Location,
		private activatedRoute: ActivatedRoute,
		private locationService: LocationService,
		private router: Router
  	) { }

  	updateLocationSubmit() {
  		this.processing = true;
  		this.locationService.editLocation(this.location).subscribe(data => {
  			if (!data.success){
  				this.messageClass ='alert alert-danger';
  				this.message = data.message;
  				this.processing = false;
  			} else {
				this.messageClass ='alert alert-success';
  				this.message = data.message;
  				setTimeout(() => {
  					this.router.navigate(['/locations']);
  				},2000);
  			}
  		})

  	}

  	goBack() {
  	this.locationAng.back()
  	}

    addLocation() {
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                    this.location.lat = position.coords.latitude,
                    this.location.lng = position.coords.longitude
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        break;
                    case 3:
                        console.log('Timeout');
                        break;
                }
            }
        );
    } else { 
        this.messageClass = 'alert alert-success';
        this.message = 'Geolocation is not supported by this browser.';
    }
  }

  mapClicked($event){
    if ($event.coords.lat && $event.coords.lng) {
        this.location.lat = $event.coords.lat
        this.location.lng = $event.coords.lng
    }
  }

  	ngOnInit() {
  		this.currentUrl = this.activatedRoute.snapshot.params
  		this.locationService.getSingleLocation(this.currentUrl.id).subscribe(data => {
  			if (!data.success){
  				this.messageClass ='alert alert-danger';
  				this.message = 'Location not found';
  			} else {
				this.location = data.location[0];
				this.loading = false;
  			}
  		});
  	}

}
