import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import {By} from "@angular/platform-browser";
import {AuthService} from "../../services/auth.service";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const validRegistrationRequest = {
    email: 'john@doe.com',
    password: 'goodP@ssw0rd',
    firstName: 'John',
    lastName: 'Doe'
  }

  const mockAuthService = {
    register: jest.fn((x) => of(null)),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message on error condition', () => {
    component.onError = true;
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.error'));

    // Expect element to exist
    expect(errorElement).toBeTruthy();
    // ...and to display the proper error message
    expect(errorElement.nativeElement.innerHTML).toEqual('An error occurred');
  });

  it('should be valid when every field is valid', () => {
    component.form.setValue(validRegistrationRequest);
    expect(component.form.valid).toBe(true);
  });

  it('should not be valid when missing email', () => {
    component.form.setValue({
      email: '',
      password: 'goodP@ssw0rd',
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid when missing password', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: '',
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid when missing first name', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: '',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid when missing last name', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: 'John',
      lastName: ''
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if email is malformed', () => {
    component.form.setValue({
      email: 'notavalidemailaddress',
      password: 'goodP@ssw0rd',
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if firstName under 3 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: 'Jo',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if firstName over 20 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: 'J'.repeat(21),
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if lastName under 3 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: 'John',
      lastName: 'Do'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if lastName over 20 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'goodP@ssw0rd',
      firstName: 'John',
      lastName: 'D'.repeat(21)
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if password under 3 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'aa',
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if password over 40 characters', () => {
    component.form.setValue({
      email: 'john@doe.com',
      password: 'a'.repeat(41),
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(component.form.valid).toBe(false);
  });

  it('should register the user on submission', () => {
    component.form.setValue(validRegistrationRequest);
    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledTimes(1);
  });

  it('should throw an error on registration failure', () => {
    component.form.setValue(validRegistrationRequest);
    mockAuthService.register.mockReturnValueOnce(throwError(() => new Error()));
    component.submit();
    expect(component.onError).toEqual(true);
  });

  it('should redirect to login page after successful registration', () => {
    component.form.setValue(validRegistrationRequest);
    jest.spyOn(router, 'navigate');
    component.submit();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
