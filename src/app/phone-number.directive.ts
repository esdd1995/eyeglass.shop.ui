import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/\D/g, '');

    // Only format if the numeric value length is greater than 4
    if (numericValue.length > 9) {
      if (numericValue[0] !== '0')
        inputElement.value = '0' + numericValue;
      else
        inputElement.value = numericValue;
    }
  }
}