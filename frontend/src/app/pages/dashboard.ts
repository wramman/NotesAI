import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

import { NotesUiService } from '../core/notes-ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export class Dashboard implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly ui = inject(NotesUiService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      void this.ui.load();
    }
  }

  onTitle(value: string): void {
    this.ui.patchSelected({ title: value });
  }

  onContent(value: string): void {
    this.ui.patchSelected({ content: value });
  }
}
