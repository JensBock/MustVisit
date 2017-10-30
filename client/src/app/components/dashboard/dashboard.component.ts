import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  locations;
  disableDefaultUI;
  zoomControl;
  streetViewControl;
  zoom: number = 10;
  loc;
  bounds;
  loaded = false;

  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private mapsAPILoader: MapsAPILoader
    ) 

    { 
    
    }

  getAllLocations(){
    this.locationService.getAllLocations().subscribe(data => {
      this.locations = data.locations;
      this.loaded = true;
      this.setMapLoad();
  });
  }

  setMapLoad(){
    this.mapsAPILoader.load().then(
    () => {
      if (this.locations){
        this.bounds = new google.maps.LatLngBounds();
        for (let location of this.locations) {
          if (location.lat,location.lng){
            this.loc = new google.maps.LatLng(location.lat, location.lng);
            this.bounds.extend(this.loc);
          }
        }
      }
    }
  )
  }

  mapClicked($event){
  console.log("test")
  }

  ngOnInit() {
    this.getAllLocations();
  }

}