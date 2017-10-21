import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

	messageClass;
	message;
	newLocation = false;
  form;
  processing = false;
  username;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService
  ) { 
    this.createNewLocationForm();
   }

  createNewLocationForm(){
    this.form = this.formBuilder.group({
      title: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
      ])]
    })
  }

  enableNewLocationForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewLocationForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)) {
      return null
    } else {
      return {'alphaNumericValidation': true}
    }
  };

  newLocationForm() {
    this.newLocation = true; // Show new blog form
  }

  onLocationSubmit() {
  	this.newLocation = true;
    this.disableNewLocationForm();

    const location = {
    title: this.form.get('title').value,
    body: this.form.get('body').value,
    createdBy: this.username
    }

    this.locationService.newLocation(location).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableNewLocationForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() =>{
          this.newLocation = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableNewLocationForm();
        },2000)
      }
    });
  }

  goBack() {
    window.location.reload();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe( profile => {
      this.username = profile.user.username;
    })
  }

}
