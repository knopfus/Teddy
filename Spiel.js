class Spiel {
    constructor() {
        [ this.links, this.breite, this.höhe ] = Spielaufbau.Welt
    }

    aufbauen() {
        let name, links, unten, z, breite, höhe, kannDaraufStehen;

        [ links, unten, z, breite, höhe ] = Spielaufbau.Teddy;
        this.teddy = new Teddy(links, unten, z, breite, höhe, this);

        this.alleMöbel = [ ];
        for (const möbel of Spielaufbau.Möbel) {
            [ name, links, unten, z, breite, höhe ] = möbel;

            const vorlage = ZusammengesetzteMöbelvorlagen[name];
            if (vorlage) {
                // Möbel muss aus mehreren Teilen zusammengesetzt werden
                const zusammengesetztesMöbel =
                    MöbelZusammensetzen(vorlage, links, unten, z, breite, höhe);
                for (const teil of zusammengesetztesMöbel) {
                    [ name, links, unten, z, breite, höhe, kannDaraufStehen ] = teil;
                    this.alleMöbel.push(new Möbel(name, links, unten, z, breite, höhe, kannDaraufStehen));
                }
            } else {
                // Einteiliges Möbel
                this.alleMöbel.push(new Möbel(name, links, unten, z, breite, höhe));
            }
        }

        this.allePlüschtiere = [ ];
        for (const plüschtier of Spielaufbau.Plüschtiere) {
            [ name, links, unten, z, breite, höhe ] = plüschtier;
            this.allePlüschtiere.push(new Plüschtier(name, links, unten, z, breite, höhe));
        }
    }

    tick() {
        this.teddy.bewegen();

        if (this.teddy.stehtAufBoden()) {
            this.verloren();
        }

        let allePlüschtiereImBett = true; // Annahme

        for (let i = 0; i < this.allePlüschtiere.length; i++) {
            const plüschtier = this.allePlüschtiere[i];

            if (!plüschtier.genommen) {
                allePlüschtiereImBett = false;

                if (this.teddy.stehtBei(plüschtier)) {
                    plüschtier.folgen(this.teddy);
                    this.tönen("hm");
                }
            } else {
                plüschtier.bewegen();
                if (plüschtier.stehtAufMöbel != "BettInnen") {
                    allePlüschtiereImBett = false;
                }
            }
        }

        if (allePlüschtiereImBett) {
            this.gewonnen();
        }
    }

    tönen(ton) {
        let audio = new Audio("Töne/" + ton + ".wav");
        audio.play();
    }

    gewonnen() {
        this.istGewonnen = true;
    }

    verloren() {
        this.istVerloren = true;
    }
}

class SpielDarsteller {
    constructor(spiel, document) {
        this.spiel = spiel;
        this.document = document;
    }

    aufbauen() {
        this.divWelt = this.document.getElementById("Welt");
        this.divWelt.style.left = this.spiel.links + "px";
        this.divWelt.style.width = this.spiel.breite + "px";
        this.divWelt.style.height = this.spiel.höhe + "px";
    
        this.teddyDarsteller = new TeddyDarsteller(this.spiel.teddy, this);
        this.alleMöbelDarsteller = [];

        for (let i = 0; i < this.spiel.alleMöbel.length; i++) {
            const möbel = this.spiel.alleMöbel[i];
            this.alleMöbelDarsteller.push(new MöbelDarsteller(möbel, this))
        }

        this.allePlüschtierDarsteller = [];

        for (let i = 0; i < this.spiel.allePlüschtiere.length; i++) {
            const plüschtier = this.spiel.allePlüschtiere[i];
            this.allePlüschtierDarsteller.push(new PlüschtierDarsteller(plüschtier, this))
        }
    }

    darstellen() {
        if (this.spiel.istVerloren) {
            document.getElementById("Verloren").style.display = "block";
        }

        if (this.spiel.istGewonnen) {
            document.getElementById("Gewonnen").style.display = "block";
            document.getElementById("Gewonnen").style.backgroundColor = "";
            window.setTimeout(function() {
                document.getElementById("Gewonnen").style.backgroundColor = "rgba(0,0,30,0.7)";
                document.getElementById("GewonnenImg").style.opacity = "1";
            }, 10);
        }

        this.divWelt.style.left = this.spiel.links + "px";
        this.teddyDarsteller.darstellen();
        for (let i = 0; i < this.alleMöbelDarsteller.length; i++) {
            const MöbelDarsteller = this.alleMöbelDarsteller[i];
            MöbelDarsteller.darstellen();
        }
        for (let i = 0; i < this.allePlüschtierDarsteller.length; i++) {
            const PlüschtierDarsteller = this.allePlüschtierDarsteller[i];
            PlüschtierDarsteller.darstellen();
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

        this.window.onkeypress = (event) => {
            if (event.key == "s") {
                this.spiel.teddy.tempo = 3;
            } else if (event.key == "1") {
                this.spiel.teddy.links = 500;
                this.spiel.teddy.unten = 300;
            } else if (event.key == "2") {
                this.spiel.teddy.links = 1500;
                this.spiel.teddy.unten = 300;
            } else if (event.key == "3") {
                this.spiel.teddy.links = 2500;
                this.spiel.teddy.unten = 300;
            }
        }
    }

    starteTimer() {
        this.timer = this.window.setInterval(() => {
            this.spiel.tick();
            this.spielDarsteller.darstellen();
            if (this.spiel.istVerloren || this.spiel.istGewonnen) {
                this.stoppeTimer();
            }
        }, 10);
    }

    stoppeTimer() {
        this.window.clearInterval(this.timer);
    }
}