import { TestBed, inject } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../app.module';

import { MessageSnackbarService } from './message-snackbar.service';

describe('MessageSnackbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    });
  });

  it('should be created', inject([MessageSnackbarService], (service: MessageSnackbarService) => {
    expect(service).toBeTruthy();
  }));
});
