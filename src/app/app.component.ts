import { Component } from '@angular/core';

import { Music } from './music';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-music-player';
  audio = new Audio();

  musicList: Music[] = [
    { 
      album: "YouTube", 
      title: "Bumbly March", 
      artist: "Kevin MacLeod", 
      url: "/assets/bumbly-march.mp3" 
    },
    { 
      album: "YouTube", 
      title: "Covert Affair", 
      artist: "Kevin MacLeod", 
      url: "/assets/covert-affair.mp3" 
    },
    { 
      album: "YouTube", 
      title: "Marty Gots a Plan", 
      artist: "Kevin MacLeod", 
      url: "/assets/marty-gots-a-plan.mp3" 
    },
    
  ];
  displayedColumns: string[] = ['title', 'artist', 'album'];
  trackPointer: number = 0;
  currentMusic: Music = {
    album: "",
    title: "",
    artist: "",
    url: ""
  }

  play(index?: number): void {
    if (index === undefined) {
      if (this.audio.paused) {
        if (this.audio.readyState === 0) {
          this.trackPointer = 0;
          this.currentMusic = this.musicList[0];
          this.audio.src = this.currentMusic.url;
        }
        this.audio.play();
      } else {
        this.audio.pause();
      }
    } else {
      this.trackPointer = index;
      this.currentMusic = this.musicList[index];
      this.audio.src = this.currentMusic.url;
      this.audio.play();
    } 
  }

  prev(): void {
    this.trackPointer--;
    this.currentMusic = this.musicList[this.trackPointer];
    this.audio.src = this.currentMusic.url;
    this.audio.play();
  }

  next(): void {
    this.trackPointer++;
    this.currentMusic = this.musicList[this.trackPointer];
    this.audio.src = this.currentMusic.url;
    this.audio.play();
  }
  
}
