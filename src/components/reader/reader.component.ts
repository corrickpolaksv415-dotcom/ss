
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderComponent {
  title = input.required<string>();
  content = input.required<string>();
  back = output<void>();

  fontSize = signal(18); // Default font size in pixels

  formattedContent() {
    // Replace newline characters with <br> tags for HTML rendering.
    // This is a simple way to preserve paragraphs from the AI response.
    return this.content().replace(/\n/g, '<br><br>');
  }

  increaseFontSize() {
    this.fontSize.update(size => Math.min(size + 2, 32)); // Max font size 32px
  }

  decreaseFontSize() {
    this.fontSize.update(size => Math.max(size - 2, 12)); // Min font size 12px
  }

  onBack() {
    this.back.emit();
  }
}
