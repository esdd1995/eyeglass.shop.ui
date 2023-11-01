import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.css'],
})
export class CustomToastComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() toastType: string = 'success';

  // Function to set the CSS class based on toast type
  getToastClass() {
    switch (this.toastType) {
      case 'warning':
        return 'custom-toast-warning';
      case 'success':
        return 'custom-toast-success';
      case 'danger':
        return 'custom-toast-danger';
      default:
        return 'success';
    }
  }
}
