import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterWidgetComponent } from './writer-widget.component';

describe('WriterWidgetComponent', () => {
  let component: WriterWidgetComponent;
  let fixture: ComponentFixture<WriterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriterWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
