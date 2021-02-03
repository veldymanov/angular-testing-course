import { TestBed, ɵTestingCompiler } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from "./courses.service";
import { COURSES, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy();
        expect(courses.length).toBe(12);

        const course = courses.find(course => course.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');
      });

      const req = httpTestingController.expectOne('/api/courses');

      expect(req.request.method).toEqual('GET');

      req.flush({payload: Object.values(COURSES)});
  });

  it('should find course by id', () => {
    const courseId = 12;

    coursesService.findCourseById(courseId)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(courseId);
      });

      const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

      expect(req.request.method).toEqual('GET');

      req.flush(COURSES[courseId]);
  });

  it('should update course', () => {
    const courseId = 12;
    const courseUpdates: Partial<Course> = {
      titles: {
        description: 'Angular Testing Course 13'
      },
    }

    coursesService.saveCourse(courseId, courseUpdates)
      .subscribe(course => {
        expect(course.id).toBe(courseId);
      });

      const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body.titles.description).toEqual(courseUpdates.titles.description)

      req.flush({
        ...COURSES[courseId],
        ...courseUpdates
      });
  });

  it('should give an error if save course fails', () => {
    const courseId = 12;
    const courseUpdates: Partial<Course> = {
      titles: {
        description: 'Angular Testing Course 13'
      },
    }

    coursesService.saveCourse(courseId, courseUpdates)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body.titles.description).toEqual(courseUpdates.titles.description)

      req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a course lessons', () => {
    const courseId = 12;
    const pageSize = 2;

    coursesService.findLessons(courseId, '', 'asc', 1, pageSize)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(pageSize);
      });

      const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('courseId')).toEqual(courseId.toString());
      expect(req.request.params.get('sortOrder')).toEqual('asc');
      expect(req.request.params.get('pageNumber')).toEqual('1');
      expect(req.request.params.get('pageSize')).toEqual(pageSize.toString());

      req.flush({
        payload: Object.values(LESSONS).filter(lesson => lesson.courseId === courseId).slice(0, pageSize)
      });
  });
});
