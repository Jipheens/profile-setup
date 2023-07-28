import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewEmployeeComponent } from './create-new-employee.component';

describe('CreateNewEmployeeComponent', () => {
  let component: CreateNewEmployeeComponent;
  let fixture: ComponentFixture<CreateNewEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
