import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStatComponent } from './cart-stat.component';

describe('CartStatComponent', () => {
  let component: CartStatComponent;
  let fixture: ComponentFixture<CartStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
