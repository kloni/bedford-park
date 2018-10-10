import {
  LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, Input, EventEmitter, Output } from '@angular/core';

const uniqueId = require('lodash/uniqueId');

/*
 * @name paginationLayout
 * @id pagination-layout-component
*/
@Component({
  selector: 'pagination-layout-component',
  templateUrl: './paginationLayout.html',
  styleUrls: ['./paginationLayout.scss'],
  preserveWhitespaces: false
})
export class PaginationLayoutComponent {

  // current page number
  @Input() pageNumber: number;
  // total items in all pages
  @Input() total: number;
  // page size
  @Input() pageSize: number;
  // check if content is being loaded
  @Input() loading: boolean;
  // how many pages to to show between next/prev
  @Input() pagesToShow: number;

  @Output() goPrev = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();
  @Output() goPage = new EventEmitter<number>();

  id: any;

  constructor() { }

  ngOnInit() {
    this.id = uniqueId();
  }
  /** Gets the minimum item on current page */
  getMin(): number {
    return ((this.pageSize * this.pageNumber) - this.pageSize) + 1;
  }
  /** Gets the maximum item on current page  */
  getMax(): number {
    let max = this.pageSize * this.pageNumber;
    if (max > this.total) {
      max = this.total;
    }
    return max;
  }

  /** Goes to specified page */
  onPage(n: number): void {
    this.goPage.emit(n);
  }
  /** Goes to previous page */
  onPrev(): void {
    this.goPrev.emit(true);
  }

  /** Goes to next page */
  onNext(next: boolean): void {
    this.goNext.emit(next);
  }

  /** Gets the total number of pages */
  totalPages(): number {
    return Math.ceil(this.total / this.pageSize) || 0;
  }
  /** If current page is the last page */
  lastPage(): boolean {
    return this.pageSize * this.pageNumber >= this.total;
  }

  /** Gets the page list to show */
  getPages(): number[] {
    const c = Math.ceil(this.total / this.pageSize);
    const p = this.pageNumber || 1;
    const pagesToShow = this.pagesToShow || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }
}