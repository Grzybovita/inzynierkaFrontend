import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailsCardComponent } from './map-details-card.component';

describe('MapDetailsCardComponent', () => {
  let component: MapDetailsCardComponent;
  let fixture: ComponentFixture<MapDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapDetailsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
