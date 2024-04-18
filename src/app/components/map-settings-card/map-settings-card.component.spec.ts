import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSettingsCardComponent } from './map-settings-card.component';

describe('MapSettingsCardComponent', () => {
  let component: MapSettingsCardComponent;
  let fixture: ComponentFixture<MapSettingsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapSettingsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapSettingsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
