var glavaZmije;
igra = {
    poeni: 0,
    tikBroj: 0,
    tajmer: null,
    okvir: [
            "####################",
            "#                  #",
            "#                  #",
            "#                  #",
            "#       ####       #",
            "#       ####       #",
            "#       ####       #",
            "#       ####       #",
            "#                  #",
            "#                  #",
            "#                  #",
            "####################"
        ],
    jabuka: [
        {x: 4, y: 9}
    ],
    tikTak: function () {
        igra.tikBroj++;
        if (igra.tikBroj % 10 == 0) {
            igra.randomVocka();
        }
        var rezultat = zmija.pokret();
        if (rezultat == "gameover") {
            alert("Osvojili ste " + igra.poeni + " poena");
            return;
        }
        grafika.nacrtajIgru();
        igra.tajmer = window.setTimeout("igra.tikTak()", 500);
    },
    randomVocka: function() {
        var randomY = Math.floor(Math.random() * igra.okvir.length) + 0;
        var randomX = Math.floor(Math.random() * igra.okvir[randomY].length) + 0;
        var randomLokacija = {x: randomX, y: randomY};
        if (igra.akoPraznoPolje(randomLokacija) && !igra.akoVocka(randomLokacija)) {
            igra.jabuka.push(randomLokacija);
        }
    },
    akoPraznoPolje: function(lokacija) {
        return igra.okvir[lokacija.y] [lokacija.x] == ' ';
    },
    akoPrepreka: function(lokacija) {
        return igra.okvir[lokacija.y] [lokacija.x] == '#';
    },
    akoVocka: function(lokacija) {
        for (var brojVocke = 0; brojVocke < igra.jabuka.length; brojVocke++) {
            var voce = igra.jabuka[brojVocke];
            if (lokacija.x == voce.x && lokacija.y == voce.y) {
                igra.jabuka.splice(brojVocke, 1);
                return true;
            }
        }
        return false;
    },
    akoZmija: function(lokacija) {
        for (var komadZmije = 0; komadZmije < zmija.tijeloZmije.length; komadZmije++) {
            var komad = zmija.tijeloZmije[komadZmije];
            if (lokacija.x == komad.x && lokacija.y == komad.y) {
                return true;
            }
        }
    }
};

var grafika = {
    platno: document.getElementById('canvas'),
    velKvadrat: 25,
    /*nacrtaj: function (kocka, source, color, border) {
        source.forEach(function(dio) {
            var dioXlokacija = dio.x * grafika.velKvadrat;
            var dioYlokacija = dio.y * grafika.velKvadrat;
            kocka.fillStyle = color ;
            kocka.strokestyle = border;
            kocka.fillRect(dioXlokacija, dioYlokacija, 20, 15);
            kocka.strokeRect(dioXlokacija, dioYlokacija, 20, 15);
        })
    },*/
    napraviOkvir: function (kocka) {
        var yOsa = 0;
        igra.okvir.forEach( function napraviOkvir(red) {
            red = red.split('');
            var xOsa = 0;
            red.forEach(function provjeriKarakter(karakter) {
                if (karakter == '#') {
                   kocka.fillStyle = "black";
                    kocka.fillRect(xOsa, yOsa, grafika.velKvadrat, grafika.velKvadrat);
                }
                xOsa += grafika.velKvadrat;
            });
               yOsa += grafika.velKvadrat;
        });        
    },
    nacrtaJabuku: function(kocka) {
            igra.jabuka.forEach(function(dio) {
            var xLokacijaVocke = dio.x * grafika.velKvadrat;
            var yLokacijaVocke = dio.y * grafika.velKvadrat;
            kocka.strokestyle = "black";
            kocka.beginPath();
            kocka.arc(xLokacijaVocke, yLokacijaVocke, 8, 0, 2 * Math.PI);
            kocka.fillStyle = "red";
            kocka.fill();
            kocka.stroke();
            //kocka.fillRect(xLokacijaVocke, yLokacijaVocke, 20, 15);
            //kocka.strokeRect(xLokacijaVocke, yLokacijaVocke, 20, 15);

        });
    },
    nacrtajZmiju: function(kocka) {
        zmija.tijeloZmije.forEach(function nacrtajDio(dio) {
            var dioXlokacija = dio.x * grafika.velKvadrat;
            var dioYlokacija = dio.y * grafika.velKvadrat;
            glavaZmije[0] = false;
            kocka.fillStyle = glavaZmije ? "yellow" : "green";
            // kocka.fillStyle = "green";
            kocka.strokestyle = "black";
            kocka.fillRect(dioXlokacija, dioYlokacija, 20, 15);
            kocka.strokeRect(dioXlokacija, dioYlokacija, 20, 15);
        });
    }, 
    nacrtajIgru: function () {
        var kocka = grafika.platno.getContext('2d');
        kocka.clearRect(0, 0, grafika.platno.width, grafika.platno.height);
        grafika.napraviOkvir(kocka);
        grafika.nacrtaJabuku(kocka);
        grafika.nacrtajZmiju(kocka);
        /*grafika.nacrtaj(kocka, igra.jabuka, "orange", "black");
        grafika.nacrtaj(kocka, zmija.tijeloZmije, "brown", "black");*/
    }
};
var zmija = {
    tijeloZmije: [
        {x: 14, y: 9},
        {x: 15, y: 9},
        {x: 16, y: 9}
    ],
    facing: "W",
    sledecaLokacija: function () {
        glavaZmije = zmija.tijeloZmije[0];
        var metaX = glavaZmije.x;
        var metaY = glavaZmije.y;
        metaY = zmija.facing == "N" ? metaY-1 : metaY;
        metaY = zmija.facing == "S" ? metaY+1 : metaY;
        metaX = zmija.facing == "W" ? metaX-1 : metaX;
        metaX = zmija.facing == "E" ? metaX+1 : metaX;
        return {x: metaX, y: metaY};
    },
    pokret: function () {
        var lokacija = zmija.sledecaLokacija();
     
        if (igra.akoPrepreka(lokacija) || igra.akoZmija(lokacija)) {
            return "gameover";
        }
        if (igra.akoPraznoPolje(lokacija)) {
            zmija.tijeloZmije.unshift(lokacija);
            zmija.tijeloZmije.pop();
        }
        if (igra.akoVocka(lokacija)) {
            zmija.tijeloZmije.unshift(lokacija);
            igra.poeni++;
            document.getElementById('poeni').innerHTML = igra.poeni;
        }
    }
};

var glavaX = zmija.tijeloZmije[0].x;
var glavaY = zmija.tijeloZmije[0].y;

function prihvatiIme() {
    var inputPolje = document.getElementById('inputPolje').value;
    document.getElementById('imeIgraca').innerHTML = inputPolje;
    document.getElementById('ukloniInput').style.display = 'none';
}
function igrajZmiju() {
    document.getElementById('pocetnaStrana').style.display = "none";
    document.getElementById('glavnaStrana').style.display = "block";
    igra.tikTak();
}

var gore = document.getElementById('dugmeGore');
var dole = document.getElementById('dugmeDole');
var lijevo = document.getElementById('dugmeLijevo');
var desno = document.getElementById('dugmeDesno');

var kontrola = {
    dugmeGore: function() {
        zmija.facing = "N";
        if (zmija.facing == "N") {
            dole.disabled = true;
            gore.disabled = false;
            lijevo.disabled = false;
            desno.disabled = false;
        }
    },
    dugmeDole: function() {
            zmija.facing = "S";
        if (zmija.facing == "S") {
            dole.disabled = false;
            gore.disabled = true;
            lijevo.disabled = false;
            desno.disabled = false;
            }
    },
    dugmeLijevo: function() {
        zmija.facing = "W";
          if (zmija.facing == "W") {
            desno.disabled = true;
            lijevo.disabled = false;
            dole.disabled = false;
            gore.disabled = false;
        }
    },
    dugmeDesno: function() {
        zmija.facing = "E";
           if (zmija.facing == "E") {
            lijevo.disabled = true;
            desno.disabled = false;
            dole.disabled = false;
            gore.disabled = false;
        }
    }
} 
