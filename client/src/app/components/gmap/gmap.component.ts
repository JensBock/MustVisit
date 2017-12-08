import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { ProgressbarService } from '../../services/progressbar.service';

import { PopupLocationComponent } from '../popup-location/popup-location.component';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  popupLocationDialogRef: MatDialogRef<PopupLocationComponent>;

  locations;
  bounds;
  searchTags = [];

  constructor(
  private progressbarService: ProgressbarService,
  private mapsAPILoader: MapsAPILoader,
  private dialog: MatDialog
  ) 
  { }

  receiveTags($event){
    this.searchTags = $event;
  }

  setMapLoad(locations,user){
    this.mapsAPILoader.load().then(
    () => {
      if (locations){
        this.bounds = new google.maps.LatLngBounds();
        for (let location of locations) {
          if (location.lat,location.lng){
			      location.iconUrl = user == location.createdBy ? '../../../assets/MarkerPerson32.png' : '../../../assets/Marker32.png' ;
            let loc = new google.maps.LatLng(location.lat, location.lng);
            this.bounds.extend(loc);
          }
        }
        this.locations = locations;
        this.progressbarService.disable();
      }
    }
  )
  }

 markerClick(id) {
  this.openDialog(id)
}

 openDialog(id) {
    this.popupLocationDialogRef = this.dialog.open(PopupLocationComponent , {
      hasBackdrop: true,
      maxHeight:"95vh",
      data: {
        id: id
      }
    });
  }

  ngOnInit() {
  }

}
