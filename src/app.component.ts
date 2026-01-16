
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { ReaderComponent } from './components/reader/reader.component';
import { GeminiService } from './services/gemini.service';

type ViewState = 'search' | 'loading' | 'reader' | 'error';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SearchComponent, ReaderComponent],
})
export class AppComponent {
  view = signal<ViewState>('search');
  novelTitle = signal('');
  novelContent = signal('');
  errorMessage = signal('');

  constructor(private geminiService: GeminiService) {}

  async onSearch(title: string) {
    if (!title) return;
    this.novelTitle.set(title);
    this.view.set('loading');
    
    try {
      const content = await this.geminiService.fetchNovelChapter(title);
      this.novelContent.set(content);
      this.view.set('reader');
    } catch (error) {
      console.error('Error fetching novel chapter:', error);
      const err = error as Error;
      this.errorMessage.set(`Failed to generate the story. ${err.message || 'Please try again later.'}`);
      this.view.set('error');
    }
  }

  onBackToSearch() {
    this.novelTitle.set('');
    this.novelContent.set('');
    this.errorMessage.set('');
    this.view.set('search');
  }
}
