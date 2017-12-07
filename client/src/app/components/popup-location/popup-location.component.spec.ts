import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../app.module';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PopupLocationComponent } from './popup-location.component';

describe('PopupLocationComponent', () => {
  let component: PopupLocationComponent;
  let fixture: ComponentFixture<PopupLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'},{provide: MAT_DIALOG_DATA, useValue: 'Test'},{provide: MatDialogRef, useValue: 'Test'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
