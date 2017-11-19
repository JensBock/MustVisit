import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLocationComponent } from './popup-location.component';

describe('PopupLocationComponent', () => {
  let component: PopupLocationComponent;
  let fixture: ComponentFixture<PopupLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLocationComponent ]
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
