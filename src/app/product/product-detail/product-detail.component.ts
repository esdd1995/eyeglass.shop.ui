import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { ProductService } from '../_service/product.service';
import { ProductDetailModel, ProductPriceModel, TryArMaskedModel } from '../_model/product.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BasketLocalModel } from 'src/app/shoping/_model/basket.model';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('scrollableDiv') scrollableDiv: ElementRef;
  @ViewChild('myDialog') myDialog: HTMLDialogElement;
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;
  private isGesturing = false;
  private gestureInterval: any;


  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  productId: number
  model: ProductDetailModel
  mainImageUrl: string
  selectedPrice: ProductPriceModel
  maskedImageModel: TryArMaskedModel

  mainMaskedUrl: string
  haveMaskeModel: boolean = false

  constructor(private productService: ProductService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,


  ) {
    this.route.params.subscribe(params => { this.productId = +params['productId'] });

  }
  ngOnInit(): void {
    this.model = new ProductDetailModel()
    this.selectedPrice = new ProductPriceModel()
    this.getDetailById()
    this.getMaskedImageModelFromLocal()
  }
  openDialog() {
    const dialog: any = document.getElementById("favDialog");
    if (dialog)
      dialog.show();
  }
  getDetailById() {
    this.hasError = false;
    const subscr = this.productService
      .getDetailById(this.productId)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.model = result
          this.setMainImageUrl(this.model.galleries[0].url)
          this.selectedPrice = this.model.prices[0]
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }
  getPictureUrl(imageUrl: string) {
    const apiUrl = `${environment.apiUrl}Files`
    if (!imageUrl) {
      return "none";
    }
    return `${apiUrl}/${imageUrl}`;
  }
  setMainImageUrl(url: string): void {
    const apiUrl = `${environment.apiUrl}Files`;
    if (!url) {
      return;
    }
    this.mainImageUrl = `${apiUrl}/${url}`;
  }
  sanitizedArticleDescription(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  tryAR() {
    this.router.navigate(['/tryAR-beta', this.productId]);
  }
  addToBasket() {
    let basketLocalModel: BasketLocalModel[] = []
    const basketItemsJSON = localStorage.getItem("local-basket");
    if (basketItemsJSON)
      basketLocalModel = JSON.parse(basketItemsJSON)
    let product = basketLocalModel.filter(x => x.productId == this.productId && x.productPriceId == this.selectedPrice.id)[0];
    if (product)
      basketLocalModel.filter(x => x.productId == this.productId && x.productPriceId == this.selectedPrice.id)[0].count++;
    else {
      let bl = new BasketLocalModel()
      bl.count = 1
      bl.productId = this.productId
      bl.productPriceId = this.selectedPrice.id
      //TODO:
      // bl.type = x.type
      basketLocalModel.push(bl)
    }
    localStorage.setItem("local-basket", JSON.stringify(basketLocalModel))
  }

  getMaskedImageModelFromLocal() {
    const maskedImageModelJSON = localStorage.getItem(`maskedImageModel-${this.productId}`)
    if (maskedImageModelJSON) {
      this.maskedImageModel = JSON.parse(maskedImageModelJSON)
      if (this.maskedImageModel.urls.length > 0) {
        this.haveMaskeModel = true
        this.mainMaskedUrl = this.maskedImageModel.urls[0]
      }
      this.openDialog()
    }
    else
      this.maskedImageModel = new TryArMaskedModel()
  }
  getNextUrl() {
    var nextIndex = getNextIndex(this.maskedImageModel.urls, this.mainMaskedUrl);
    this.mainMaskedUrl = this.maskedImageModel.urls[nextIndex]
    this.setPhoto(nextIndex)
    this.cdr.detectChanges();

  }
  getPastUrl() {
    const pastIndex = getPastIndex(this.maskedImageModel.urls, this.mainMaskedUrl);
    this.mainMaskedUrl = this.maskedImageModel.urls[pastIndex];
    this.setPhoto(pastIndex)
    this.cdr.detectChanges();

  }
  setPhoto(idx: number) {
    let image: any = document.getElementById("canvas");
    if (image)
      image.src = this.getPictureUrl(this.maskedImageModel.urls[idx]);
  }
  // Touch/Gesture event handler for horizontal gestures
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event'])
  onGesture(event: TouchEvent) {
    if (this.touchStartX === null || this.touchStartY === null) {
      return;
    }

    const scrollableDiv = this.scrollableDiv.nativeElement;
    const deltaX = event.touches[0].clientX - this.touchStartX;
    const deltaY = event.touches[0].clientY - this.touchStartY;

    if (this.isDescendantOrSelf(scrollableDiv, event.target as Node)) {
      if (Math.abs(deltaX) > 10 && Math.abs(deltaY) < 10) {
        // Horizontal gesture with significant movement (more than 10 pixels)
        event.preventDefault();
        if (deltaX > 0) {
          // Gesture to the right
          this.startGesturing(() => this.getNextUrl());
        } else {
          // Gesture to the left
          this.startGesturing(() => this.getPastUrl());
        }
      }
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.stopGesturing();
    this.touchStartX = null;
    this.touchStartY = null;
  }

  private startGesturing(callback: () => void) {
    if (!this.isGesturing) {
      this.isGesturing = true;
      this.gestureInterval = setInterval(() => callback(), 100); // Adjust the interval as needed
    }
  }

  private stopGesturing() {
    if (this.isGesturing) {
      this.isGesturing = false;
      clearInterval(this.gestureInterval);
    }
  }

  private scrollTimeout: number | null = null;
  private scrollDistanceThreshold = 100; // Adjust this threshold as needed

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent) {
    const scrollableDiv = this.scrollableDiv.nativeElement;

    if (this.isDescendantOrSelf(scrollableDiv, event.target as Node)) {
      event.preventDefault();

      if (Math.abs(event.deltaY) >= this.scrollDistanceThreshold) {
        // Clear any existing timeout
        if (this.scrollTimeout !== null) {
          clearTimeout(this.scrollTimeout);
        }

        // Set a new timeout to delay the scroll handling
        this.scrollTimeout = window.setTimeout(() => {
          if (event.deltaY > 0) {
            // Scroll down
            this.getNextUrl();
          } else {
            // Scroll up
            this.getPastUrl();
          }
          this.scrollTimeout = null; // Reset the timeout
        }, 50); // 300 milliseconds delay
      }
    }
  }

  isDescendantOrSelf(parent: Node, child: Node): boolean {
    return parent === child || parent.contains(child);
  }
}
function getNextIndex<T>(arr: T[], currentElement: T): number {
  const currentIndex = arr.indexOf(currentElement);
  if (currentIndex === -1) {
    return -1; // You can choose to handle this case differently if needed
  }

  const nextIndex = (currentIndex + 1) === arr.length ? 0 : currentIndex + 1;
  return nextIndex;
}
function getPastIndex<T>(arr: T[], currentElement: T): number {
  const currentIndex = arr.indexOf(currentElement);
  if (currentIndex === -1) {
    return -1; 
  }

  const pastIndex = currentIndex === 0 ? arr.length - 1 : currentIndex - 1;
  return pastIndex;
}


