import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';


describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const allCourses = setupCourses();
  const beginnerCorses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCorses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(async () => {
    const coursesCoursesSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    await TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesCoursesSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCorses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1);
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCorses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1);
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2);
  });


  fit("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2);

    // click(tabs[1]);
    tabs[1].nativeElement.click();

    fixture.detectChanges();

    tick(500);

    const tabBodies = el.queryAll(By.css('.mat-tab-body'));

    expect(tabBodies.length).toBe(2);
    expect(tabBodies[1].nativeElement.classList.contains('mat-tab-body-active')).toBeTrue();
  }));
});
