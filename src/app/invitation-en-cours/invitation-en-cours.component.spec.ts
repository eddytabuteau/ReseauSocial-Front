import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationEnCoursComponent } from './invitation-en-cours.component';

describe('InvitationEnCoursComponent', () => {
  let component: InvitationEnCoursComponent;
  let fixture: ComponentFixture<InvitationEnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationEnCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
