import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NotesUiService } from '../core/notes-ui';
import { ThemeService } from '../core/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly ui = inject(NotesUiService);
  protected readonly theme = inject(ThemeService);
}
