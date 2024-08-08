import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';

import {ListComponent} from './list.component';
import {By} from "@angular/platform-browser";
import {SessionApiService} from "../../services/session-api.service";
import {MockSessionApiService} from "../../services/session-api.service.mock";
import {NO_ERRORS_SCHEMA} from "@angular/core";


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        {provide: SessionService, useValue: mockSessionService},
        {provide: SessionApiService, useClass: MockSessionApiService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show create button if user is an admin', () => {
    const createButton = fixture.debugElement.query(By.css('button[data-test=create-button]'));
    expect(createButton).not.toBeNull();
  });

  it('should show update button if user is an admin', () => {
    const detailButton = fixture.debugElement.query(By.css('button[data-test=update-button]'));
    expect(detailButton).not.toBeNull();
  });
});
