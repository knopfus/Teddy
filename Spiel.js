var Spielaufbau = {
    Grösse: [ 1000, 600 ],
    Möbel: {
        // links, unten, z, breite, höhe
        Tisch: [ 0, 0, 30, 313, 161 ],
        Stuhlsitz: [ 400, 0, 20, 108, 87 ],
        Stuhllehne: [ 400, 87, 10, 75, 74 ]
    },
    Teddy: [ 800, 500, 25, 44, 62 ]
}

class Spiel {
    constructor() {
        this.breite = Spielaufbau.Grösse[0];
        this.höhe = Spielaufbau.Grösse[1];
    }

    aufbauen() {
        this.teddy = new Teddy(Spielaufbau.Teddy[0], Spielaufbau.Teddy[1], Spielaufbau.Teddy[2], Spielaufbau.Teddy[3], Spielaufbau.Teddy[4], this);
        this.alleMöbel = [ ];
        for (const name in Spielaufbau.Möbel) {
            const möbel = Spielaufbau.Möbel[name];
            this.alleMöbel.push(new Möbel(name, möbel[0], möbel[1], möbel[2], möbel[3], möbel[4]));
        }
    }

    tick() {
        this.teddy.bewegen();
    }

    tönen(ton) {
        let audio = new Audio("Töne/" + ton + ".wav");
        audio.play();
    }
}

class SpielDarsteller {
    constructor(spiel, document) {
        this.spiel = spiel;
        this.document = document;
    }

    aufbauen() {
        this.divWelt = this.document.getElementById("Welt");
        this.divWelt.style.width = this.spiel.breite + "px";
        this.divWelt.style.height = this.spiel.höhe + "px";
    
        this.teddyDarsteller = new TeddyDarsteller(this.spiel.teddy, this);
        this.alleMöbelDarsteller = [];

        for (let i = 0; i < this.spiel.alleMöbel.length; i++) {
            const möbel = this.spiel.alleMöbel[i];
            this.alleMöbelDarsteller.push(new MöbelDarsteller(möbel, this))
        }
    }

    darstellen() {
        this.teddyDarsteller.darstellen();
        for (let i = 0; i < this.alleMöbelDarsteller.length; i++) {
            const MöbelDarsteller = this.alleMöbelDarsteller[i];
            MöbelDarsteller.darstellen();
        }
    }
}

class SpielSteuerung {
    constructor(spiel, spielDarsteller, window) {
        this.spiel = spiel;
        this.spielDarsteller = spielDarsteller;
        this.window = window;
    }

    einrichten() {
        this.teddySteuerung = new TeddySteuerung(this.spiel.teddy, this);

        this.window.onkeydown = (event) => {
            this.teddySteuerung.tasteGedrückt(event.key);
        };

        this.window.onkeyup = (event) => {
            this.teddySteuerung.tasteLosgelassen(event.key);
        };
    }

    starteTimer() {
        this.timer = this.window.setInterval(() => {
            this.spiel.tick();
            this.spielDarsteller.darstellen();
        }, 10);
    }
}