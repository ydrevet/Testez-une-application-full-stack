import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { By } from "@angular/platform-browser";
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {of, throwError} from "rxjs";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const goodRequest = {
    email: 'test@test.com',
    password: 'goodP@ssw0rd',
  };

  const mockSessionInformation: SessionInformation = {
    admin: false,
    firstName: "",
    id: 0,
    lastName: "",
    token: "",
    type: "",
    username: ""
  }
  const mockAuthService = {
    login: jest.fn(() => of(mockSessionInformation))
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule],
      providers: [
        SessionService,
        {provide: AuthService, useValue: mockAuthService},
      ],

    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should not be valid if missing email', () => {
    component.form.setValue({
      email: '',
      password: 'password',
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if missing password', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: '',
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if email is malformed', () => {
    component.form.setValue({
      email: 'thisisnotavalidemailaddress',
      password: 'goodP@ssw0rd',
    });
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid if password is under 3 characters', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: '12',
    });
    expect(component.form.valid).toBe(false);
  });

  it('should be valid if both fields provided are valid', () => {
    component.form.setValue(goodRequest);
    expect(component.form.valid).toBe(true);
  });

  it('should login the user on submission', () => {
    component.form.setValue(goodRequest);
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthService.login).toHaveBeenCalledWith(goodRequest as LoginRequest);
  });

  it('should raise an error when login attempt failed', () => {
    component.form.setValue(goodRequest);
    mockAuthService.login.mockReturnValueOnce(throwError(() => new Error()));

    component.submit();

    expect(component.onError).toEqual(true);
  });
});
