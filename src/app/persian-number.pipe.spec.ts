import { PersianNumberPipe } from './persian-number.pipe';

describe('PersianNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new PersianNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
