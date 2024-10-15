import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';

import {DetailComponent} from './detail.component';
import {By} from "@angular/platform-browser";
import {Session} from "../../interfaces/session.interface";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {SessionApiService} from "../../services/session-api.service";
import {ListComponent} from "../list/list.component";
import {Router} from "@angular/router";


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApiService = {
    delete: jest.fn(() => of(null)),
    detail: jest.fn((_) => of(mockSession)),
  };

  const mockSession: Session = {
    date: new Date(),
    description: "",
    name: "",
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 1,
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: 'sessions',
          component: ListComponent
        }]),
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        {provide: SessionService, useValue: mockSessionService},
        {provide: SessionApiService, useValue: mockSessionApiService},
        {provide: MatSnackBar, useValue: mockMatSnackBar},
      ],
    })
      .compileComponents();
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    component = fixture.componentInstance;
    component.session = mockSession;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back a page on back button clicked', () => {
    jest.spyOn(window.history, 'back');
    let backButton = fixture.debugElement.query(By.css('[data-test="back-button"]')).nativeElement;
    backButton.click();
    expect(window.history.back).toHaveBeenCalledTimes(1);
  });

  it('should allow an administrator to delete a session', () => {
    component.isAdmin = true;
    fixture.detectChanges();

    let deleteButton = fixture.debugElement.query(By.css('[data-test="delete-button"]'));

    expect(deleteButton).toBeTruthy();
  });

  it('should not allow a regular user to delete a session', () => {
    component.isAdmin = false;
    fixture.detectChanges();

    let deleteButton = fixture.debugElement.query(By.css('[data-test="delete-button"]'));

    expect(deleteButton).toBeFalsy();
  })

  it('should delete the session when delete button is pressed', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledTimes(1);
  });

  it('should display a snackbar after deletion', () => {
    component.delete();
    expect(mockMatSnackBar.open).toHaveBeenCalledTimes(1);
  });

});

