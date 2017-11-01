import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoneycombanimComponent } from './honeycombanim.component';

describe('HoneycombanimComponent', () => {
  let component: HoneycombanimComponent;
  let fixture: ComponentFixture<HoneycombanimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoneycombanimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoneycombanimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
