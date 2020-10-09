import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSubListComponent } from './group-sub-list.component';

describe('GroupSubListComponent', () => {
  let component: GroupSubListComponent;
  let fixture: ComponentFixture<GroupSubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
