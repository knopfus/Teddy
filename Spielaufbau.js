var Spielaufbau = {
    // [ links, breite, höhe ]
    Welt: [ -1000, 2000, 600 ],
    Möbel: [
        // [ name, links, unten, z, breite, höhe ]
        [ "Tisch", 1000, 0, 30, 313, 161 ],
        [ "Stuhl", 1350, 0, 20, 108, 161 ],
        [ "Stuhl", 1800, 6, 20, 108, 161 ],
        [ "Sofa", 1500, 0, 20, 250, 250 * 307 / 479 ],
        [ "Geländer", 100, 0, 20, 824, 195 ]
    ],
    // [ links, unten, z, breite, höhe ]
    Teddy: [ 1860, 93, 25, 44, 62 ]
}



var ZusammengesetzteMöbelvorlagen = {
    Stuhl: [
        // [ name,              links,  unten,  z,  breite, höhe ]
        [ "Stuhlsitz",          0,      0,      2,  108,    87 ],
        [ "Stuhllehne",         0,      87,     -2, 75,     74 ]
    ],
    Sofa: [
        // [ name,              links,  unten,  z,  breite, höhe ]
        [ "Sofalehne",          68,     176,    0,  411,    131 ],
        [ "Sofasitz",           68,     0,      2,  356,    176 ],
        [ "SofaArmlehneLinks",  0,      0,      2,  68,     240 ],
        [ "SofaArmlehneRechts", 424,    0,      2,  55,     237 ]
    ]
};



var MöbelZusammensetzen = function(Möbelvorlage, links, unten, z, breite, höhe) {
    var Möbel = JSON.parse(JSON.stringify( Möbelvorlage ));

    var maxBreite = Möbel.reduce((p, c, i, a) => Math.max(p, c[1] + c[4]), 0);
    var maxHöhe = Möbel.reduce((p, c, i, a) => Math.max(p, c[2] + c[5]), 0);

    for (const Teil of Möbel) {
        Teil[1] = Teil[1] * breite / maxBreite + links;
        Teil[2] = Teil[2] * höhe / maxHöhe + unten;
        Teil[3] += z;
        Teil[4] *= breite / maxBreite;
        Teil[5] *= höhe / maxHöhe;
    }

    return Möbel;
};
