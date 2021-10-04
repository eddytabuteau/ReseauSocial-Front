import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAccueilComponent } from './chat-accueil.component';

describe('ChatAccueilComponent', () => {
  let component: ChatAccueilComponent;
  let fixture: ComponentFixture<ChatAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAccueilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
