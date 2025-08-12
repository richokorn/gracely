import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeChangelogComponent } from './welcome-changelog.component';

describe('WelcomeChangelogComponent', () => {
  let component: WelcomeChangelogComponent;
  let fixture: ComponentFixture<WelcomeChangelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeChangelogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeChangelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
