import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
constructor(private router: Router, private firestore: Firestore){}

  async newGame() { 
    let game = new Game();
    let collectionInstance = collection(this.firestore, 'games');
    let gameInfo = await addDoc(collectionInstance, game.toJson());
    this.router.navigateByUrl('/game/' + gameInfo['id']);

  }
}
