import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { AppRoutingModule } from './app.routing.module';

import { MatDialogModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LocationsComponent } from './components/locations/locations.component';
import { EditLocationComponent } from './components/locations/edit-location/edit-location.component';
import { DeleteLocationComponent } from './components/locations/delete-location/delete-location.component';
import { NewLocationComponent } from './components/locations/new-location/new-location.component';
import { PopupLocationComponent } from './components/popup-location/popup-location.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { MessageSnackbarComponent } from './components/message-snackbar/message-snackbar.component';
import { TagSearchBarComponent } from './components/tag-search-bar/tag-search-bar.component';
import { GmapComponent } from './components/gmap/gmap.component';

import { AuthService } from './services/auth.service';
import { LocationService } from './services/location.service';
import { Picturebase64Service } from './services/picturebase64.service';
import { ValidateService } from './services/validate.service';
import { ProgressbarService } from './services/progressbar.service';
import { MessageSnackbarService } from './services/message-snackbar.service';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { env } from '../environments/env';
import { TagPipe } from './pipes/tag.pipe';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    LocationsComponent,
    EditLocationComponent,
    DeleteLocationComponent,
    NewLocationComponent,
    PopupLocationComponent,
    ProgressbarComponent,
    MessageSnackbarComponent,
    GmapComponent,
    TagPipe,
    TagSearchBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule
    AgmCoreModule.forRoot({
      apiKey: env.GOOGLE_API_KEY
    })
  ],
  entryComponents: [PopupLocationComponent, MessageSnackbarComponent],
  providers: [AuthService, AuthGuard, NotAuthGuard, LocationService, ValidateService, Picturebase64Service, ProgressbarService, MessageSnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
