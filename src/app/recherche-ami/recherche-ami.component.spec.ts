import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheAmiComponent } from './recherche-ami.component';

describe('RechercheAmiComponent', () => {
  let component: RechercheAmiComponent;
  let fixture: ComponentFixture<RechercheAmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheAmiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheAmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
