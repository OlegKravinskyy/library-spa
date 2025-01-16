import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ScreenService {
  private resizeSource = new Subject<null>();
  public resize$ = this.resizeSource.asObservable();
  largePixels = 780;
  screenWidth!: number;
  screenHeight!: number;

  constructor() {
    try {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.addEventListener('resize', (event) => this.onResize(event));
    } catch (error) {
      console.log(error);
    }
  }

  onResize(event: Event): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.resizeSource.next(null);
  }

  isLarge(): boolean {
    return this.screenWidth >= this.largePixels;
  }
}
