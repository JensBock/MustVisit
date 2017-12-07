import { Component, OnInit, Inject, HostListener  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { ProgressbarService } from '../../services/progressbar.service';
import { Picturebase64Service } from '../../services/picturebase64.service';

@Component({
  selector: 'app-popup-location',
  templateUrl: './popup-location.component.html',
  styleUrls: ['./popup-location.component.css']
})
export class PopupLocationComponent implements OnInit{

  location;
  username;
  mapHeight;

  constructor(
  private dialogRef: MatDialogRef<PopupLocationComponent>,
  @Inject(MAT_DIALOG_DATA) private data,
  private progressbarService: ProgressbarService,
  private picturebase64Service: Picturebase64Service,
  private authService: AuthService,
  private locationService: LocationService)
  {
  this.progressbarService.enable()
  this.getSingleLocation(data.id)
  }

  getSingleLocation(id){
    this.locationService.getSingleLocation(id).subscribe(data => {
      this.location = data.location[0];
      this.location.src = this.picturebase64Service.getImageArrayBufferToBase64(this.location.picture.img.data);
      this.progressbarService.disable()
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      let el = document.getElementById('location-picture');
      this.mapHeight = el.offsetHeight;
  }

  resetMap(){
      let el = document.getElementById('location-picture');
      this.mapHeight = el.offsetHeight;
  }

  ngOnInit() {
      this.authService.getProfile().subscribe( profile => {
      this.username = profile.user.username;
    });
  }
}
