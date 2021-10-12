import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDiscussionComponent } from './liste-discussion.component';

describe('ListeDiscussionComponent', () => {
  let component: ListeDiscussionComponent;
  let fixture: ComponentFixture<ListeDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
