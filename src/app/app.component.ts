import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Frontload';

  @HostBinding('class') className = ''

  ngOnInit(): void {
      document.querySelector('html')?.classList.add('dark-mode')
  }
}
