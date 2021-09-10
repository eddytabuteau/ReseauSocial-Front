import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchecInscriptionComponent } from './echec-inscription.component';

describe('EchecInscriptionComponent', () => {
  let component: EchecInscriptionComponent;
  let fixture: ComponentFixture<EchecInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchecInscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EchecInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
