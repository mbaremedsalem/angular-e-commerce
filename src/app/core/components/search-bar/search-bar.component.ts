// search-bar.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  searchQuery = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchQuery);
  }
}