import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  isStandalone(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const nav = window.navigator as Navigator & { standalone?: boolean };
    if (nav.standalone === true) {
      return true;
    }

    if (window.matchMedia) {
      return window.matchMedia('(display-mode: standalone)').matches;
    }

    return false;
  }
}
