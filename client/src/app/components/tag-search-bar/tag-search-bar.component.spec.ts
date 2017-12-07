import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSearchBarComponent } from './tag-search-bar.component';

describe('TagSearchBarComponent', () => {
  let component: TagSearchBarComponent;
  let fixture: ComponentFixture<TagSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
