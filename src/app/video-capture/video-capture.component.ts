import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileCategory } from '../common/enum/file-category.enum';
import { FileModel } from '../product/_model/file.model';
import { ProductService } from '../product/_service/product.service';
import { Observable, Subscription, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TryArMaskedModel, TryArRawModel } from '../product/_model/product.model';
import { get } from 'jquery';

@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.css']
})
export class VideoCaptureComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  videoStream: MediaStream | undefined;
  photoInterval: number = 700; // Capture a photo every 700 milliseconds (adjust as needed)
  capturedPhotos: Blob[] = [];
  isCapturing = false;

  timerText: string = '';
  
  rawImageModel: TryArRawModel
  maskedImageModel: TryArMaskedModel

  productId: number
  uniqueName: string
  private unsubscribe: Subscription[] = [];
  isLoading$: Observable<boolean>;
  captureTimeInSec: number = 4;
  constructor(private productService: ProductService, 
    private route: ActivatedRoute,
    private router: Router) {
    this.isLoading$ = this.productService.isLoading$;
    this.route.params.subscribe(params => { this.productId = +params['productId'] });
  }

  async ngOnInit() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      this.videoElement.nativeElement.srcObject = this.videoStream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
    this.maskedImageModel = new TryArMaskedModel()
    this.setUniqueName()
    this.getRawImageModelFromLocal() 
  }
  setUniqueName() {
    var un_local = localStorage.getItem("uniqueName")
    if (un_local && un_local.length > 5)
      this.uniqueName = un_local
    else {
      this.uniqueName = generateUniqueFileName()
      localStorage.setItem("uniqueName", this.uniqueName)
    }
  }
  getRawImageModelFromLocal() {
    const rawImageModelJSON = localStorage.getItem("rawImageModel");
    if (rawImageModelJSON)
      this.rawImageModel = JSON.parse(rawImageModelJSON)
    else
    this.rawImageModel = new TryArRawModel()
  }
  setRawImageModelLocal() {
    localStorage.setItem("rawImageModel", JSON.stringify(this.rawImageModel))
  }
  setMaskedImageModelLocal() {
    localStorage.setItem(`maskedImageModel-${this.productId}`, JSON.stringify(this.maskedImageModel))
  }

  startCapturing() {
    const captureDuration = this.captureTimeInSec * 1000
    this.capturedPhotos = [];
    this.isCapturing = true;
    this.displayTimer()
    const mediaStream = this.videoStream;
    if (!mediaStream) {
      console.error('Video stream not available');
      return;
    }

    const captureInterval = setInterval(() => {
      this.capturePhoto(mediaStream);
    }, this.photoInterval);

    setTimeout(() => {
      this.stopCapturing(captureInterval);
    }, captureDuration); // Capture photos for 4 seconds
  }

  stopCapturing(captureInterval: number) {
    clearInterval(captureInterval);
    console.log('Capture complete. Sending photos to endpoint...');
    this.sendPhotosToEndpoint(this.capturedPhotos);
  }

  capturePhoto(mediaStream: MediaStream) {
    const videoElement = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        this.capturedPhotos.push(blob);
      }
    }, 'image/jpeg', 0.9); // You can adjust the format and quality as needed
  }
  sendPhotosToEndpoint(photos: Blob[]) {
    // Create an array of File objects from the captured photos
    const files: File[] = photos.map((blob, index) => {
      const fileName = `photo_${index + 1}.jpg`; // You can generate unique file names
      return new File([blob], fileName);
    });
    console.log(files)
      const f = this.rawImageModel.rawUrls.length > 0 ? [] : files
    // Create a FileModel and populate it
    const fileModel: FileModel = {
      files: f,
      category: FileCategory.ArPhoto,
      uniqueName: this.uniqueName,
      productId: this.productId,
      rawUrls: this.rawImageModel.rawUrls
    };
    // Implement the code to send the FileModel to your desired endpoint.
    this.upload(fileModel)
  }
  upload(files: FileModel) {
    this.productService.upload(files).pipe(first())
      .subscribe((result: any) => {
        if (result && result.ok == false) {
          // this.toastService.error(result.error.message);
        } else {
          console.log(result);
          this.rawImageModel.rawUrls = result.rawUrls
          this.rawImageModel.uniqueName
          this.setRawImageModelLocal()
          this.maskedImageModel.urls = result.urls
          this.maskedImageModel.productId = this.productId
          this.setMaskedImageModelLocal()
          console.log(this.maskedImageModel,this.rawImageModel)
          this.goToDetail()
        }
      }, err => {
        // this.toastService.error(err.error.message);
      });
  }
  displayTimer() {
  
    const intervalId = setInterval(() => {
      const minutes = Math.floor((this.captureTimeInSec + 1) / 60);
      const seconds = (this.captureTimeInSec + 1) % 60;
  
      const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
      const secondsStr = seconds < 10 ? '0' + (seconds - 1) : (seconds - 1).toString();
  
      this.timerText = `${minutesStr}:${secondsStr}`;
      this.captureTimeInSec--;
  
      if (this.captureTimeInSec < 0) {
        clearInterval(intervalId);
        this.timerText = '';
        this.isCapturing = false
        this.captureTimeInSec = 4;
      }
    }, 1000);
  }
  goToDetail(){
    this.router.navigate(['/product-detail/glass', this.productId]);
  }
}

function generateUniqueFileName(): string {
  // Gather device information
  const userAgent: string = navigator.userAgent;
  const screenResolution: string = `${window.screen.width}x${window.screen.height}`;

  // Generate a random identifier (UUID)
  const randomIdentifier: string = uuidv4();

  // Combine device information and random identifier
  const uniqueTerm: string = `${userAgent}_${screenResolution}_${randomIdentifier}`;

  // Remove invalid characters for file names and replace with underscores
  const fileNameFriendlyTerm: string = uniqueTerm.replace(/[^a-zA-Z0-9_-]/g, '_');

  return fileNameFriendlyTerm;
}

function uuidv4(): string {
  // Generate a random UUID (not cryptographically secure)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r: number = (Math.random() * 16) | 0;
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

