// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-rating-stars',
//   templateUrl: './rating-stars.component.html',
//   styleUrls: ['./rating-stars.component.scss']
// })
// export class RatingStarsComponent {

// }


// rating-stars.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent {
  @Input() rating: number | string = 0;
  
  get fullStars(): number {
    const num = typeof this.rating === 'string' ? parseFloat(this.rating) : this.rating;
    return Math.floor(num);
  }
  
  get hasHalfStar(): boolean {
    const num = typeof this.rating === 'string' ? parseFloat(this.rating) : this.rating;
    return num % 1 >= 0.5;
  }
  
  get emptyStars(): number {
    return 5 - this.fullStars - (this.hasHalfStar ? 1 : 0);
  }
}