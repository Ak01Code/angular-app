import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-add-event-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.css',
})
export class AddEventDialogComponent {
  formData = {
    eventName: '',
    eventDate: '',
    eventCategory: '',
  };

  selectedFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    private eventService: EventService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit(form: NgForm) {
    if (form.invalid) return;

    const formDataToSend = new FormData();
    formDataToSend.append('eventName', this.formData.eventName);
    formDataToSend.append('eventDate', this.formData.eventDate);
    formDataToSend.append('eventCategory', this.formData.eventCategory);

    if (this.selectedFile) {
      formDataToSend.append('eventImage', this.selectedFile);
    }

    this.eventService.createEvent(formDataToSend).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Create event error:', err),
    });
  }
}
