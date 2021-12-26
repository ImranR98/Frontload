import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: any[] = [];

  showToast(message: string, title: string = "Info") {
    this.toasts.push({ title, message });
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

}
