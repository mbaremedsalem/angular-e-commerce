// loading-spinner.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent { }