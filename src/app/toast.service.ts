
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressAnimation: 'decreasing',
      closeButton: true,
    });
  }
  showInfo(message: string, title?: string) {
    this.toastr.info(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressAnimation: 'decreasing',
      closeButton: false,
    });
  }
  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressAnimation: 'decreasing',
      closeButton: false,
    });
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      progressAnimation: 'decreasing',
      closeButton: false,
    });
  }
}
