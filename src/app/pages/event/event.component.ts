import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../../components/add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-event',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  events: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  search: string = '';
  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents(this.currentPage, this.search);
  }

  fetchEvents(page: number, search: string) {
    this.eventService.getEvent(page, search).subscribe({
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

  onSearchChange() {
    this.currentPage = 1;
    this.fetchEvents(this.currentPage, this.search);
  }

  openAddEventDialog() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // If event was created, refresh the list
      if (result) {
        this.search = '';
        this.fetchEvents(this.currentPage, this.search);
      }
    });
  }

  goToPage(page: number) {
    if (this.currentPage !== page) {
      this.fetchEvents(page, this.search);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.fetchEvents(this.currentPage + 1, this.search);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.fetchEvents(this.currentPage - 1, this.search);
    }
  }
}
