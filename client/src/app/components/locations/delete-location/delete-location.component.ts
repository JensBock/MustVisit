import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-location',
  templateUrl: './delete-location.component.html',
  styleUrls: ['./delete-location.component.css']
})
export class DeleteLocationComponent implements OnInit {
  message;
  messageClass;
  foundLocation = false;
  processing = false;
  location;
  currentUrl;

  constructor(
    private locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  deleteLocation() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.locationService.deleteLocation(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/locations']);
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.locationService.getSingleLocation(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.location = data.location[0];
        this.foundLocation = true;
      }
    });
  }

}
