import { Component } from '@angular/core';

import { Music } from './music';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-music-player';

  musicList: Music[] = [];
  displayedColumns: string[] = ['title', 'artist', 'album'];
}
