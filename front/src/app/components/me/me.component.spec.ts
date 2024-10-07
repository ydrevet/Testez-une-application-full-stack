import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from "@jest/globals";

import { MeComponent } from './me.component';
import {User} from "../../interfaces/user.interface";
import {Observable, of} from "rxjs";
import {UserService} from "../../services/user.service";
import {By} from "@angular/platform-browser";
import {Router} from "@angular/router";

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userGetByIdSpy: jest.SpyInstance;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn(),
  };

  const mockUser: User = {
    admin: true,
    createdAt: new Date(),
    email: "john.doe@example.com",
    firstName: "John",
    id: 1,
    lastName: "Doe",
    password: "password",
    updatedAt: new Date(),
  }

  const mockUserService = {
    getById: (id: String): Observable<User> => {
      if (id === "1") {
        return of(mockUser);
      } else {
        throw new Error('Unexpected user ID');
      }
    },
    delete: jest.fn().mockReturnValue(of(null)),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    userGetByIdSpy = jest.spyOn(mockUserService, 'getById');
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currently logged in user on init', () => {
    expect(userGetByIdSpy).toHaveBeenCalledTimes(1);
    expect(userGetByIdSpy).toHaveBeenCalledWith(mockUser.id.toString());
    expect(component.user).toEqual(mockUser);
  });

  it('should go back a page when back button pressed', () => {
    const windowBackSpy = jest.spyOn(window.history, 'back');
    const backButton = fixture.debugElement.query(By.css('button[data-test=back-button]')).nativeElement;
    backButton.click();
    expect(windowBackSpy).toHaveBeenCalledTimes(1);
  });

  it('should delete the current user when delete button pressed', () => {
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalledTimes(1);
    expect(mockUserService.delete).toHaveBeenCalledWith(mockSessionService.sessionInformation.id.toString());
  });

  it('should display a confirmation message on user deletion', () => {
    component.delete();
    expect(mockMatSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
  });

  it('should log out the user after deletion', () => {
    component.delete();
    expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
  });

  it('should redirect the user to the home page after deletion', () => {
    const routerNavigateSpy = jest.spyOn(router, 'navigate');

    component.delete();

    expect(routerNavigateSpy).toHaveBeenCalledTimes(1);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/']);
  })
});
