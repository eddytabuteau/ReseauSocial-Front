import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMessageProfilComponent } from './liste-message-profil.component';

describe('ListeMessageProfilComponent', () => {
  let component: ListeMessageProfilComponent;
  let fixture: ComponentFixture<ListeMessageProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeMessageProfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeMessageProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
