import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubListComponent } from './user-sub-list.component';

describe('UserSubListComponent', () => {
  let component: UserSubListComponent;
  let fixture: ComponentFixture<UserSubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
