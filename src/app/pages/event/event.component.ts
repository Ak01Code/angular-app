import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../../components/add-event-dialog/add-event-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

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
  private searchSubject = new Subject<string>();
  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchEvents(this.currentPage, this.filter);

    this.searchSubject
      .pipe(
        debounceTime(400) // wait 400ms after typing stops
      )
      .subscribe((searchTerm: string) => {
        this.filter.search = searchTerm;
        this.fetchEvents(this.currentPage, this.filter);
      });
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
        this.toastr.error(err?.message, 'Error');
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
    this.searchSubject.next(this.filter.search);
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
          this.toastr.success('Delete Event Successfull', 'Success');
          this.fetchEvents(this.currentPage, this.filter);
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message, 'Error');
        console.log('delete error', err);
      },
    });
  }
}
