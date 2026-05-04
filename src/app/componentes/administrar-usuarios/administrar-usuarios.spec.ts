import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarUsuarios } from './administrar-usuarios';

describe('AdministrarUsuarios', () => {
  let component: AdministrarUsuarios;
  let fixture: ComponentFixture<AdministrarUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
