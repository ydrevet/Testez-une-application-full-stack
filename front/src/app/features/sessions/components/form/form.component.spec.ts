import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import {NavigationExtras, Router} from "@angular/router";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  describe('as an administrator', () => {
    const mockSessionService = {
      sessionInformation: {
        admin: true
      }
    }

    beforeEach(async () => {
      await TestBed.configureTestingModule({

        imports: [
          RouterTestingModule,
          HttpClientModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          MatSelectModule,
          BrowserAnimationsModule
        ],
        providers: [
          {provide: SessionService, useValue: mockSessionService},
          SessionApiService
        ],
        declarations: [FormComponent]
      })
        .compileComponents();

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  })

  describe('as a regular user', () => {
    const mockSessionService = {
      sessionInformation: {
        admin: false
      }
    }
    let routerSpy: jest.SpyInstance<Promise<boolean>, [commands: any[], extras?: NavigationExtras | undefined]>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({

        imports: [
          RouterTestingModule,
          HttpClientModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule,
          MatSnackBarModule,
          MatSelectModule,
          BrowserAnimationsModule
        ],
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          SessionApiService,
        ],
        declarations: [FormComponent]
      })
        .compileComponents();

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      const router = TestBed.inject(Router);
      routerSpy = jest.spyOn(router, 'navigate');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should redirect to session page', () => {
      expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
    });
  })

});
