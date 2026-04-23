import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type CategoryName = 'Politics' | 'Crypto' | 'Sports' | 'Tech' | 'Science';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ic" [attr.data-cat]="cat">
      @switch (cat) {
        @case ('Politics') {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 21h16v-2H4v2zm2-4h12v-2H6v2zm1-4h10V3H7v10zm2-8h6v6H9V5z"/>
          </svg>
        }
        @case ('Crypto') {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 2h-2v2.1a5.6 5.6 0 0 0-2.8.9L7 3.8 5.6 5.2 6.8 6.4a5.8 5.8 0 0 0-.9 2.8H3.8v2H6a6 6 0 0 0 .9 2.8l-1.3 1.3 1.4 1.4 1.3-1.3a6 6 0 0 0 2.8.9V22h2v-2.1a6 6 0 0 0 2.8-.9l1.3 1.3 1.4-1.4-1.3-1.3a6 6 0 0 0 .9-2.8h2.1v-2h-2.1a6 6 0 0 0-.9-2.8l1.3-1.3-1.4-1.4-1.3 1.3a6 6 0 0 0-2.8-.9V2zm-1 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
          </svg>
        }
        @case ('Sports') {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 6.9 4H5.1A8 8 0 0 1 12 4zm-8 8c0-.7.1-1.4.3-2h15.4c.2.6.3 1.3.3 2s-.1 1.4-.3 2H4.3c-.2-.6-.3-1.3-.3-2zm8 8a8 8 0 0 1-6.9-4h13.8A8 8 0 0 1 12 20z"/>
          </svg>
        }
        @case ('Tech') {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h10v2H7V2zm2 20v-2h6v2H9zM6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v8h12V8H6z"/>
          </svg>
        }
        @case ('Science') {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 2h4v2l-1 1v4.6l4.9 8.5A3 3 0 0 1 15.3 22H8.7a3 3 0 0 1-2.6-4.5L11 9.6V5L10 4V2zm1.8 9.4-4 7a1 1 0 0 0 .9 1.6h6.6a1 1 0 0 0 .9-1.6l-4-7h-.4z"/>
          </svg>
        }
        @default {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z"/>
          </svg>
        }
      }
    </span>
  `,
  styles: [`
    .ic {
      width: 1.05em;
      height: 1.05em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -0.15em;
      margin-right: 0.45em;
      filter: drop-shadow(0 0 12px rgba(55, 214, 255, 0.18));
    }
    svg { width: 100%; height: 100%; fill: currentColor; opacity: 0.95; }
    .ic[data-cat="Politics"] { color: rgba(217, 70, 239, 0.95); }
    .ic[data-cat="Crypto"] { color: rgba(55, 214, 255, 0.95); }
    .ic[data-cat="Sports"] { color: rgba(182, 255, 92, 0.95); }
    .ic[data-cat="Tech"] { color: rgba(55, 214, 255, 0.95); }
    .ic[data-cat="Science"] { color: rgba(217, 70, 239, 0.95); }
  `]
})
export class CategoryIcon {
  @Input({ required: true }) name!: string;

  get cat(): CategoryName | 'Other' {
    const n = (this.name || '').trim();
    if (n === 'Politics' || n === 'Crypto' || n === 'Sports' || n === 'Tech' || n === 'Science') return n;
    return 'Other';
  }
}

