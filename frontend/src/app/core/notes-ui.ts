import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Note } from './note';
import { NotesService } from './notes.service';

export type NotesView = 'all' | 'favorites' | 'notebooks' | 'archive' | 'settings';

export interface NavItem {
  id: NotesView;
  label: string;
  icon: string;
}

const ACCENTS = ['#605b54', '#10b981', '#f59e0b', '#9a4121', '#825516'];

@Injectable({ providedIn: 'root' })
export class NotesUiService {
  private readonly api = inject(NotesService);

  readonly views: NavItem[] = [
    // { id: 'all', label: 'All Notes', icon: 'description' },
    // { id: 'favorites', label: 'Favorites', icon: 'star' },
    // { id: 'notebooks', label: 'Notebooks', icon: 'folder' },
    // { id: 'archive', label: 'Archive', icon: 'archive' },
    // { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  readonly notes = signal<Note[]>([]);
  readonly selected = signal<Note | null>(null);
  readonly activeView = signal<NotesView>('all');
  readonly menuOpen = signal(false);
  readonly loading = signal(false);
  readonly summarizing = signal(false);
  readonly error = signal<string | null>(null);
  readonly colorPickerOpen = signal(false);
  readonly hexDraft = signal('#9a4121');

  readonly visibleNotes = computed(() => {
    const notes = this.notes();
    if (this.activeView() === 'favorites') {
      return notes.filter((note) => note.is_pinned);
    }
    return notes;
  });

  accent(id: number): string {
    return ACCENTS[id % ACCENTS.length];
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const notes = await firstValueFrom(this.api.list());
      this.notes.set(notes);
      const selected = this.selected();
      if (selected) {
        this.selected.set(notes.find((note) => note.id === selected.id) ?? null);
      }
    } catch {
      this.error.set('No se pudieron cargar las notas. ¿Está corriendo el backend?');
    } finally {
      this.loading.set(false);
    }
  }

  setView(view: NotesView): void {
    this.activeView.set(view);
    this.selected.set(null);
    this.closeMenu();
  }

  selectNote(noteId: number): void {
    const note = this.notes().find((item) => item.id === noteId) ?? null;
    this.selected.set(note);
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleColorPicker(): void {
    const selected = this.selected();
    if (!selected) {
      return;
    }
    const open = !this.colorPickerOpen();
    this.colorPickerOpen.set(open);
    if (open) {
      this.hexDraft.set(this.normalizeHex(selected.color) ?? '#9a4121');
    }
  }

  closeColorPicker(): void {
    this.colorPickerOpen.set(false);
  }

  async setColor(hex: string): Promise<void> {
    const selected = this.selected();
    const normalized = this.normalizeHex(hex);
    if (!selected || !normalized) {
      return;
    }
    this.hexDraft.set(normalized);
    this.selected.set({ ...selected, color: normalized });
    try {
      const updated = await firstValueFrom(
        this.api.update(selected.id, { color: normalized }),
      );
      this.replace(updated);
    } catch {
      this.error.set('No se pudo guardar el color');
    }
  }

  normalizeHex(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }
    const withHash = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
    return /^#[0-9A-Fa-f]{6}$/.test(withHash) ? withHash.toLowerCase() : null;
  }

  patchSelected(patch: Partial<Pick<Note, 'title' | 'content'>>): void {
    const selected = this.selected();
    if (!selected) {
      return;
    }
    this.selected.set({ ...selected, ...patch });
  }

  async createNote(): Promise<void> {
    this.closeMenu();
    this.error.set(null);
    try {
      const note = await firstValueFrom(
        this.api.create({ title: 'Untitled', content: '' }),
      );
      this.notes.update((notes) => [note, ...notes]);
      this.activeView.set('all');
      this.selected.set(note);
    } catch {
      this.error.set('No se pudo crear la nota');
    }
  }

  async saveSelected(): Promise<void> {
    const selected = this.selected();
    if (!selected) {
      return;
    }
    this.error.set(null);
    try {
      const updated = await firstValueFrom(
        this.api.update(selected.id, {
          title: selected.title,
          content: selected.content,
        }),
      );
      this.replace(updated);
    } catch {
      this.error.set('No se pudo guardar la nota');
    }
  }

  async togglePin(): Promise<void> {
    const selected = this.selected();
    if (!selected) {
      return;
    }
    try {
      const updated = await firstValueFrom(
        this.api.update(selected.id, { is_pinned: !selected.is_pinned }),
      );
      this.replace(updated);
    } catch {
      this.error.set('No se pudo actualizar el pin');
    }
  }

  async summarizeSelected(): Promise<void> {
    const selected = this.selected();
    if (!selected || this.summarizing() || !selected.content.trim()) {
      return;
    }
    this.summarizing.set(true);
    this.error.set(null);
    try {
      const updated = await firstValueFrom(this.api.summarize(selected.id));
      this.replace(updated);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 400) {
        this.error.set('Escribe contenido en la nota antes de resumir.');
      } else if (err instanceof HttpErrorResponse && err.status === 503) {
        this.error.set('No se pudo resumir. ¿Ollama está corriendo?');
      } else {
        this.error.set('No se pudo resumir la nota.');
      }
    } finally {
      this.summarizing.set(false);
    }
  }

  async deleteSelected(): Promise<void> {
    const selected = this.selected();
    if (!selected) {
      return;
    }
    this.error.set(null);
    try {
      await firstValueFrom(this.api.remove(selected.id));
      this.notes.update((notes) => notes.filter((note) => note.id !== selected.id));
      this.selected.set(null);
    } catch {
      this.error.set('No se pudo borrar la nota');
    }
  }

  private replace(updated: Note): void {
    this.notes.update((notes) =>
      notes.map((note) => (note.id === updated.id ? updated : note)),
    );
    this.selected.set(updated);
  }
}
