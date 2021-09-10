import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationAttenteConfirmationComponent } from './invitation-attente-confirmation.component';

describe('InvitationAttenteConfirmationComponent', () => {
  let component: InvitationAttenteConfirmationComponent;
  let fixture: ComponentFixture<InvitationAttenteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationAttenteConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationAttenteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
