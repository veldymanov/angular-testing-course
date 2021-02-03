import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from 'rxjs';
import { delay } from 'rxjs/operators'

describe('Async Testing Examples', () => {
  it('async test - Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      test = true;
      expect(test).toBeTrue();

      done();
    }, 500);

  });

  it('async test - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      test = true;
      expect(test).toBeTrue();
    }, 1000);

    tick(500);
    tick(500);

    expect(test).toBeTrue();
  }));

  it('async test - plain promise', fakeAsync(() => {
    let test = false;

    Promise.resolve()
      .then(() => {
        return Promise.resolve();
      })
      .then(() => {
        test = true;
      });

    flushMicrotasks();

    expect(test).toBeTrue();
  }));

  it('async test - plain promise + setTimeout()', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;

        setTimeout(() => {
          counter += 1;
        }, 1000)
      });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(1000);

    expect(counter).toBe(11);
  }));

  it('async test - Observable', fakeAsync(() => {
    let test = false;

    const test$ = of(test);

    test$
      .pipe(delay(1000))
      .subscribe(() => {
        test = true;
      });

    tick(1000);
    // flush();

    expect(test).toBeTrue();
  }));
});
