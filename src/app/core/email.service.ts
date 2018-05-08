import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  isValidEmail(email: string): boolean {
    const emailRegex = new RegExp('^([\\w\\!\\#$\\%\\&\\\'\\*\\+\\-\\/\\=\\?\\^\\`{\\|\\}\\~]+\\.)*[\\w\\!\\#$\\%\\&\\\'\\*\\+\\-\\/\\=\\?\\^\\`{\\|\\}\\~]+@((((([a-z0-9]{1}[a-z0-9\\-]{0,62}[a-z0-9]{1})|[a-z])\\.)+[a-z]{2,6})|(\\d{1,3}\\.){3}\\d{1,3}(\\:\\d{1,5})?)$');
    return emailRegex.test(email.toLowerCase());
  }
}
