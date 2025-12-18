import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSearch } from './network-search';

describe('NetworkSearch', () => {
  let component: NetworkSearch;
  let fixture: ComponentFixture<NetworkSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
