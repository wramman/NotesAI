import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Note, NoteCreate, NoteUpdate } from './note';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8000/notes';

  list() {
    return this.http.get<Note[]>(this.api);
  }

  create(body: NoteCreate) {
    return this.http.post<Note>(this.api, body);
  }

  update(id: number, body: NoteUpdate) {
    return this.http.put<Note>(`${this.api}/${id}`, body);
  }

  remove(id: number) {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text' });
  }

  summarize(id: number) {
    return this.http.get<Note>(`${this.api}/${id}/summarize`);
  }
}
