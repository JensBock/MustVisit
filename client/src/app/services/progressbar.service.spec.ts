import { TestBed, inject } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../app.module';

import { ProgressbarService } from './progressbar.service';

describe('ProgressbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    });
  });

  it('should be created', inject([ProgressbarService], (service: ProgressbarService) => {
    expect(service).toBeTruthy();
  }));
});
