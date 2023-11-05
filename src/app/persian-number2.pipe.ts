import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianNumber'
})
export class PersianNumberPipe2 implements PipeTransform {
  transform(value: number): string {
    // Convert the number to a string and replace Latin digits with Persian digits
    const persianDigits = String(value).replace(/[0-9]/g, (digit) => {
      return this.getPersianDigit(parseInt(digit, 10));
    });


    return persianDigits;
  }

  private getPersianDigit(digit: number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    if (digit >= 0 && digit <= 9) {
      return persianDigits[digit];
    }
    return String(digit);
  }

  // Helper function to add commas as thousands separators
  private addCommas(number: number): string {
    var sepe = number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return sepe
  }
}

