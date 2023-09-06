declare module 'owl.carousel' {
    interface OwlCarouselOptions {
      // Define your Owl Carousel options here
      autoplay?: boolean;
      smartSpeed?: number;
      center?: boolean;
      dots?: boolean;
      loop?: boolean;
      nav?: boolean;
      rtl?: boolean;
      responsive?: {
        [breakpoint: number]: {
          items: number;
        };
      };
    }
  
    interface OwlCarousel {
      (options?: OwlCarouselOptions): JQuery;
    }
  
    interface JQuery {
      owlCarousel(options?: OwlCarouselOptions): JQuery;
    }
  }
  