import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../app.module';

import {MAT_SNACK_BAR_DATA} from '@angular/material';

import { MessageSnackbarComponent } from './message-snackbar.component';

describe('MessageSnackbarComponent', () => {
  let component: MessageSnackbarComponent;
  let fixture: ComponentFixture<MessageSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'},{provide: MAT_SNACK_BAR_DATA, useValue: 'Test'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
