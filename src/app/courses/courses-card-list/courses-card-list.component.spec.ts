import {async, waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { compact } from 'cypress/types/lodash';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoursesModule,
      ],
      // declarations: [
      //   CoursesCardListComponent
      // ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it("should create the component", () => {
   expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = el.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = el.query(By.css('.course-card:first-child'));
    const title = card.query(By.css('mat-card-title'));

    expect(card).toBeTruthy();
    expect(title.nativeElement.textContent).toBe(course.titles.description);
  });
});
