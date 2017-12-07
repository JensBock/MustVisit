import { TestBed, inject } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../app.module';

import { Picturebase64Service } from './picturebase64.service';

describe('Picturebase64Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    });
  });

  it('should be created', inject([Picturebase64Service], (service: Picturebase64Service) => {
    expect(service).toBeTruthy();
  }));
});
