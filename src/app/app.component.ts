import { Component } from '@angular/core';

import { Music } from './music';
import * as moment from 'moment';

import { AngularFirestore } 
from '@angular/fire/compat/firestore';
import { AngularFireStorage } 
from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';

import * as jsmediatags from 'jsmediatags';
import { TagType } from 'jsmediatags/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-music-player';
  audio = new Audio();
  musicLength: string = '0:00';
  duration: number = 1;
  currentTime: string = '0:00';

  constructor(private store: AngularFirestore,
              private storage: AngularFireStorage) {
    this.audio.ondurationchange = () => {
      const totalSeconds = Math.floor(this.audio.duration),
            duration = moment.duration(totalSeconds, 'seconds');
      this.musicLength = duration.seconds() < 10 ? 
                         `${Math.floor(duration.asMinutes())}:
                          0${duration.seconds()}` : 
                         `${Math.floor(duration.asMinutes())}:
                          ${duration.seconds()}`;
      this.duration = totalSeconds;
    }

    this.audio.ontimeupdate = () => {
      const duration = moment.duration(
        Math.floor(this.audio.currentTime), 'seconds');
      this.currentTime = duration.seconds() < 10 ? 
                         `${Math.floor(duration.asMinutes())}:
                          0${duration.seconds()}` : 
                         `${Math.floor(duration.asMinutes())}:
                          ${duration.seconds()}`;
    }

    this.getAllMusic().subscribe((musicList: Music[]) => {
      this.musicList = musicList;
    });
  }

  musicList: Music[] = [];
  
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

  volumeSlider(event: any) {
    this.audio.volume = event.value / 16;
  }

  durationSlider(event: any) {
    this.audio.currentTime = event.value;
  }

  getAllMusic(): Observable<Music[]> {
    return this.store
      .collection('music', 
      ref => ref.orderBy('title'))
      .valueChanges({ idField: 'id' }).pipe() as Observable<Music[]>;
  }

  uploadMusic(event: any): void {
    for (var index = 0; index < event.target.files.length; index++) {
      const file = event.target.files[index];
      const filePath = `music/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, file).then((uploadTaskSnapshot) => {
        fileRef.getDownloadURL().subscribe((url: any) => {
          jsmediatags.read(file, {
            onSuccess: (tagType: TagType) => {
              let music: Music = {
                album: tagType.tags.album === undefined ? 
                  '' : tagType.tags.album,
                artist: tagType.tags.artist === undefined ? 
                  '' : tagType.tags.artist,
                title: tagType.tags.title === undefined ? 
                  '' : tagType.tags.title,
                url: url
              };
              this.store.collection('music').add(music);
            }
          })
        })
      })
    }
  }
  
}
