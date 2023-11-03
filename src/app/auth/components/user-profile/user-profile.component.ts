import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FileModel } from 'src/app/product/_model/file.model';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  form: FormGroup;
  user: UserModel;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private router: Router,) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      email: [''],
      address: [''],
      postalCode: [''],
      city: [''],
      state: [''],
      imageUrl: ['']
    });

    this.user = new UserModel(); // Initialize with default values or fetch it from your service
  }

  ngOnInit(): void {
    // Fetch the user data and set it in the form controls
    this.user = this.authService.currentUserValue;

    this.patchFormValue();
  }
  private patchFormValue() {
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      address: this.user.address,
      postalCode: this.user.postalCode,
      city: this.user.city,
      state: this.user.state,
      imageUrl: this.user.imageUrl
    });
  }

  logOut() {
    this.authService.logout()
  }
  showSuccessToast() {
    this.toastService.showSuccess('ورود با موفقیت انجام شد', 'خوش آمدید');
  }
  showDangerToast() {
    this.toastService.showError('ورود با موفقیت انجام شد', 'خوش آمدید');

  }

  updateUser() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.authService.updateUser(formData).subscribe(
        () => {
          // Handle success
          this.toastService.showInfo('اطلاعات کاربری به روز رسانی شد');
          console.log('User updated successfully');
          if (this.user.isNew) {
            //handle router redirect
            this.router.navigate(['/home'])
          }
          // Notify the user (you can show a success message)
        },
        (error) => {
          // Handle error
          this.toastService.showError('خطا در به روز رسانی اطلاعات');
          console.error('Error updating user', error);
          // Notify the user (you can show an error message)
        }
      );
    } else {
      // Handle form validation errors if any
      this.markFormGroupTouched(this.form);
      console.log('Form is invalid');
      // Notify the user (you can show a validation error message)
    }
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      control?.markAsTouched();
    });
  }
  upload(files: FileModel) {
    this.authService.uploadProfilePicture(files).pipe(first())
      .subscribe((result: any) => {
        if (result && result.ok == false) {
          // this.toastService.error(result.error.message);
        } else {
          console.log(result);
          this.user.imageUrl = result.urls[0];
          const imageUrlControl = this.form.get('imageUrl');
          if (imageUrlControl) { // Check if the control is defined
            imageUrlControl.setValue(this.user.imageUrl);
          }
          // this.toastService.success();
        }
      }, err => {
        // this.toastService.error(err.error.message);
      });

  }
  getPictureUrl() {
    const apiUrl = `${environment.apiUrl}Files`
    if (!this.user.imageUrl) {
      return "none";
    }
    return `${apiUrl}/${this.user.imageUrl}`;
  }

  deletePicture() {
    this.user.imageUrl = "";
  }
  handleImageUpload(event: any) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      let fileModel = new FileModel()
      fileModel.files = [file]
      this.upload(fileModel)
    }
  }
  openModal(content: any) {
    this.modalService.open(content);
  }
}
