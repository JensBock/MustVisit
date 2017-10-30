import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { LocationService } from './services/location.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { LocationsComponent } from './components/locations/locations.component';
import { EditLocationComponent } from './components/locations/edit-location/edit-location.component';
import { DeleteLocationComponent } from './components/locations/delete-location/delete-location.component';

import { AgmCoreModule } from '@agm/core';
import { env } from '../environments/env';

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
    DeleteLocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlashMessagesModule,
    AgmCoreModule.forRoot({
      apiKey: env.GOOGLE_API_KEY
    })
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
