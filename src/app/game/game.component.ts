import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, addDoc, collectionData, doc, docData, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game !: Game;
  collectionInstance;
  games$: Observable<any>;
  gameID: string;



  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {
    this.collectionInstance = collection(this.firestore, 'games');
    this.games$ = collectionData(this.collectionInstance);
  }



  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.setGame(params);
      
    });

  }


  setGame(params){
    this.gameID = params['id'];
    let currentID = doc(this.collectionInstance, this.gameID);
    let currentGame$ = docData(currentID);
    currentGame$.subscribe((game)=>{
      console.log('Game Update',game);
      this.game.currentPlayer = game['currentPlayer'];
      this.game.playedCards = game['playedCards'];
      this.game.players = game['players'];
      this.game.stack = game['stack'];
      this.game.pickCardAnimation = game['pickCardAnimation'];
      this.game.currentCard = game['currentCard'];

    })

  }

  newGame() {
    this.game = new Game();
    
  }

  saveGame() {
    let collectionInstance = collection(this.firestore, 'games');
    let docInstance = doc(collectionInstance, this.gameID);
    setDoc(docInstance, this.game.toJson());
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();




      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.saveGame();

      }, 1250);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);


    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }



}
