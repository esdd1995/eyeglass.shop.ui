import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ProductService } from '../product/_service/product.service';
import { FileModel } from '../product/_model/file.model';
import { TryArRawModel, TryArMaskedModel } from '../product/_model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FileCategory } from '../common/enum/file-category.enum';
import { first } from 'rxjs';

@Component({
  selector: 'app-webcam-snapshot',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss'],
})
export class WebcamSnapshotComponent implements OnInit, AfterViewInit {
  rawImageModel: TryArRawModel;
  maskedImageModel: TryArMaskedModel;

  WIDTH = 640;
  HEIGHT = 480;
  RATIO = 640 / 480
  captureCount: number = 2; // the number of captures
  captureIntervals: number = 700; // in milliseconds
  productId: number;
  ButtonText = 'شروع';
  isUploading = false;
  isCaptured: boolean = false;
  captures: string[] = [];
  error: any;

  @ViewChild('webcam')
  public webcam: WebcamComponent;
  @ViewChild("canvas")
  public canvas: ElementRef;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.productId = +params['productId'];
    });
  }
  ngAfterViewInit(): void {
    // this.initDeviceWidthHeight();

  }
  initDeviceWidthHeight() {
    const video = this.webcam.nativeVideoElement;
    if (video) {
      this.canvas.nativeElement.width = video.videoWidth;
      this.canvas.nativeElement.height = video.videoHeight;
    }
  }

  ngOnInit(): void {
    this.rawImageModel = new TryArRawModel();
    this.rawImageModel.uniqueName = this.setUniqueName();
    this.maskedImageModel = new TryArMaskedModel();
  }

  setUniqueName() {
    const un_local = localStorage.getItem('uniqueName');
    if (un_local && un_local.length > 5) return un_local;
    else {
      const un_new = generateUniqueFileName();
      localStorage.setItem('uniqueName', un_new);
      return un_new;
    }
  }

  async capture() {
    this.initDeviceWidthHeight();
    this.captureWithInterval(this.captureCount, this.captureIntervals, () => {
      // All repetitions are complete, so now you can upload the captured photos
      this.uploadCapturedPhotos();
    });
  }

  captureWithInterval(repetitions: number, interval: number, onComplete: () => void) {
    let currentRepetition = 0;

    const captureStep = () => {
      if (currentRepetition < repetitions) {
        // Flash the canvas white
        this.flashCanvasWhite();

        // Set 'isCaptured' to true after the specified interval
        setTimeout(() => {
          this.isCaptured = true;
          this.dispalayTextOnCanvas(`${currentRepetition + 1} از ${repetitions}`);

          // Capture the current frame to the canvas after the specified interval
          setTimeout(() => {
            this.isCaptured = true;
            const video = this.webcam.nativeVideoElement;
            const canvas = this.canvas.nativeElement;
            const ctx = canvas.getContext("2d");


            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            this.captures.push(canvas.toDataURL('image/jpeg'));

            // Set 'isCaptured' to false after the specified interval
            setTimeout(() => {
              this.isCaptured = false;
              currentRepetition++;

              // Repeat the capture step
              captureStep();

              // Check if all repetitions are complete
              if (currentRepetition === repetitions) {
                // Call the onComplete callback function
                onComplete();
              }
            }, interval * 1.2);
          }, 80);
        }, interval);
      }
    };

    // Start the capture process
    captureStep();
  }
  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }
  drawImageToCanvas(image: any) {
    const canvas = this.canvas.nativeElement;
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  flashCanvasWhite() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");

    // Flash the canvas white by drawing a white rectangle over it
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  dispalayTextOnCanvas(text: string) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Save the current canvas state (optional but recommended)
      ctx.save();

      // Set the fill color to white
      ctx.fillStyle = "white";

      // Clear the entire canvas with a white rectangle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = "24px Arial";
      ctx.fillStyle = "black"; // Text color
      ctx.textAlign = "center"; // Text alignment

      // Display text in the center of the canvas
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.fillText(text, x, y);

      // Restore the canvas state (optional but recommended)
      ctx.restore();
    } else {
      console.error("Canvas context is null.");
    }
  }


  clearCanvas() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");

    // Clear the canvas by drawing a transparent rectangle over it
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  clearCaptures() {
    this.captures = [];
  }

  uploadCapturedPhotos() {
    if (this.captures.length === 0) {
      // No photos to upload
      return;
    }

    // Create an array of File objects from the captured photos
    const files: File[] = this.captures.map((dataURL, index) => {
      // Convert data URL to Blob
      const blob = this.dataURItoBlob(dataURL);

      // Create a File from the Blob
      return new File([blob], `${generateFileName(index.toString())}.jpg`, { type: 'image/jpeg' });
    });

    const fileModel: FileModel = {
      files: files,
      uniqueName: this.rawImageModel.uniqueName,
      category: FileCategory.ArPhoto,
      productId: this.productId,
      rawUrls: [],
    };

    this.upload(fileModel);
  }

  upload(files: FileModel) {
    this.isUploading = true;

    this.productService
      .upload(files)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          if (result && result.ok == false) {
            this.isUploading = false;
            this.error = result;
            // Handle error
          } else {
            this.rawImageModel.rawUrls = result.rawUrls;
            this.setRawImageModelLocal();
            this.maskedImageModel.urls = result.urls;
            this.maskedImageModel.productId = this.productId;
            this.setMaskedImageModelLocal();
            this.isUploading = false;
            this.goToDetail();
          }
        },
        error: (err) => {
          this.isUploading = false;
          // Handle error
        },
      });
  }


  goToDetail() {
    this.router.navigate(['/product-detail/glass', this.productId]);
  }

  // Helper function to convert Data URL to Blob
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: 'image/jpeg' });
  }

  setRawImageModelLocal() {
    localStorage.setItem('rawImageModel', JSON.stringify(this.rawImageModel));
  }

  setMaskedImageModelLocal() {
    localStorage.removeItem(`maskedImageModel-${this.productId}`)
    localStorage.setItem(
      `maskedImageModel-${this.productId}`,
      JSON.stringify(this.maskedImageModel)
    );
  }
}

function generateUniqueFileName(): string {
  // Gather device information
  const userAgent: string = navigator.userAgent;
  const screenResolution: string = `${window.screen.width}x${window.screen.height}`;

  // Generate a random identifier (UUID)
  const randomIdentifier: string = uuidv4();

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
function generateFileName(text: string) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  // Combine datetime components into a file name
  const fileName = `${month}${day}_${hours}${minutes}${seconds}_${text}`;

  return fileName;
}


