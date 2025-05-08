import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../../components/add-event-dialog/add-event-dialog.component';
import { MatSelectModule } from '@angular/material/select';

interface FilterType {
  search: string;
  category: string;
}

@Component({
  selector: 'app-event',
  imports: [CommonModule, FormsModule, MatDialogModule, MatSelectModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  events: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  filter: FilterType = { search: '', category: '' };
  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents(this.currentPage, this.filter);
  }

  fetchEvents(page: number, filter: FilterType) {
    this.eventService.getEvent(page, filter).subscribe({
      next: (res) => {
        this.events = res?.data;
        this.currentPage = res?.meta?.page;
        this.totalPages = res?.meta?.totalPages;
        this.generatePageNumbers();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  generatePageNumbers() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onCategoryChange(value: string) {
    this.currentPage = 1;
    this.filter.category = value;
    this.fetchEvents(this.currentPage, this.filter);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.fetchEvents(this.currentPage, this.filter);
  }

  openAddEventDialog(eventData: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '500px',
      data: eventData || null,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // If event was created, refresh the list
      if (result) {
        this.fetchEvents(this.currentPage, this.filter);
      }
    });
  }

  goToPage(page: number) {
    if (this.currentPage !== page) {
      this.fetchEvents(page, this.filter);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.fetchEvents(this.currentPage + 1, this.filter);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.fetchEvents(this.currentPage - 1, this.filter);
    }
  }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id).subscribe({
      next: (res) => {
        if (res) {
          this.fetchEvents(this.currentPage, this.filter);
        }
      },
      error: (err) => {
        console.log('delete error', err);
      },
    });
  }
}
