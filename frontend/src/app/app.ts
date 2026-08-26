import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotesUiService } from './core/notes-ui';
import { Sidebar } from './layout/sidebar';
import { TopBar } from './layout/top-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, TopBar],
  templateUrl: './app.html',
})
export class App {
  protected readonly ui = inject(NotesUiService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.ui.closeMenu();
    this.ui.closeColorPicker();
  }
}
