import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';

import { NotesUiService } from '../core/notes-ui';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.html',
})
export class TopBar {
  protected readonly ui = inject(NotesUiService);

  @ViewChild('colorPicker') private colorPicker?: ElementRef<HTMLElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const host = this.colorPicker?.nativeElement;
    if (host && !host.contains(event.target as Node)) {
      this.ui.closeColorPicker();
    }
  }

  onPickerColor(value: string): void {
    void this.ui.setColor(value);
  }

  onHexInput(value: string): void {
    this.ui.hexDraft.set(value);
    if (this.ui.normalizeHex(value)) {
      void this.ui.setColor(value);
    }
  }
}
