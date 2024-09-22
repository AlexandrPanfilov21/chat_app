import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChannelsListComponent } from './my-channels-list.component';

describe('MyChannelsListComponent', () => {
  let component: MyChannelsListComponent;
  let fixture: ComponentFixture<MyChannelsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyChannelsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyChannelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
