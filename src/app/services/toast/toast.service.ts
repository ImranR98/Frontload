import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: { message: string, className: string, delay: number }[] = [];

  showToast(message: string, type: 'info' | 'success' | 'danger' = 'info', delay: number = 5000) {
    this.toasts.push({ message, className: `bg-${type} text-light`, delay });
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

}
