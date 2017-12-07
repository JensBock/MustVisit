import { TestBed, async } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';

import { RouterTestingModule } from '@angular/router/testing';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { AppRoutingModule } from './app.routing.module';

import { MatDialogModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { AuthService } from './services/auth.service';
import { LocationService } from './services/location.service';
import { ProgressbarService } from './services/progressbar.service';
import { Picturebase64Service } from './services/picturebase64.service';
import { MessageSnackbarService } from './services/message-snackbar.service';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps'
import { env } from '../environments/env';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        MessageSnackbarComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: AppComponent }
        ]),
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MatDialogModule,
        MatProgressBarModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        AgmCoreModule.forRoot({
            apiKey: env.GOOGLE_API_KEY
        })
      ],
      entryComponents: [PopupLocationComponent, MessageSnackbarComponent],
      providers: [AuthService, AuthGuard, NotAuthGuard, LocationService, ProgressbarService, Picturebase64Service, MessageSnackbarService, MapsAPILoader,{provide: APP_BASE_HREF, useValue: '/'}],
      bootstrap: [AppComponent],
      schemas: [
       NO_ERRORS_SCHEMA, 
       CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
