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
