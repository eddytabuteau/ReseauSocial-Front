import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSujetComponent } from './chat-sujet.component';

describe('ChatSujetComponent', () => {
  let component: ChatSujetComponent;
  let fixture: ComponentFixture<ChatSujetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSujetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSujetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
