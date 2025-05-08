import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../services/event.service';

interface EditEventType {
  creator: string;
  eventCategory: string;
  eventDate: string;
  eventImage: string;
  eventName: string;
  _id: string;
  _v?: string | number;
}

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
  selectedFile: File | string | null = null;
  imagePreviewUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddEventDialogComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: EditEventType
  ) {}

  ngOnInit() {
    if (this.data) {
      this.formData = {
        eventName: this.data.eventName || '',
        eventDate: this.data.eventDate || '',
        eventCategory: this.data.eventCategory || '',
      };
      this.imagePreviewUrl = this.data.eventImage || null;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
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

    if (this.data) {
      this.eventService.updateEvent(formDataToSend, this.data?._id).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.log('update event error', err),
      });
    } else {
      this.eventService.createEvent(formDataToSend).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Create event error:', err),
      });
    }
  }
}
