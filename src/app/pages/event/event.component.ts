import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  events: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents(this.currentPage);
  }

  fetchEvents(page: number) {
    this.eventService.getEvent(page).subscribe({
      next: (res) => {
        this.events = res?.data;
        this.currentPage = res?.meta?.page;
        this.totalPages = res?.meta?.totalPages;
        this.generatePageNumbers();
        console.log('events', res);
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  generatePageNumbers() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (this.currentPage !== page) {
      this.fetchEvents(page);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.fetchEvents(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.fetchEvents(this.currentPage - 1);
    }
  }
}
