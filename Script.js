const Spielfeld = document.getElementById("Canvas");
const ctx = Spielfeld.getContext("2d");



let Speicher = {
    Highscore: 0,
    cash: 0,
}
if (localStorage.getItem("Save")) Speicher = JSON.parse(localStorage.getItem("Save"));
document.getElementById("Cash").innerHTML = Speicher.cash;



const player = {
    x: Spielfeld.width / 2,
    y: Spielfeld.height / 2,
    dx: 0,
    dy: 0,
    Abklingzeit1: 0,
    Abklingzeit2: 0,
    Abklingzeit3: 0,
};
const coin = {
    x: Spielfeld.width / 4,
    y: Spielfeld.height / 4,
    Aktiv: false,
    Wert: 1,
    Lifetime: 99,
    shield: false,
};
let Pause = false;



const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};











function update() {
    player.dx = 0;
    player.dy = 0;

    if (keys.w || keys.ArrowUp) player.dy = -player.speed;
    if (keys.s || keys.ArrowDown) player.dy = player.speed;
    if (keys.a || keys.ArrowLeft) player.dx = -player.speed;
    if (keys.d || keys.ArrowRight) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;


    player.x = Math.max(0, Math.min(Spielfeld.width - player.Durchmesser, player.x));
    player.y = Math.max(0, Math.min(Spielfeld.height - player.Durchmesser, player.y));

    if (coin.Aktiv) {
        if (coin.x || (coin.x == (Spielfeld.width - coin.Durchmesser))) coin.dx = 0 - coin.dx;
        if (coin.y || (coin.y == (Spielfeld.height - coin.Durchmesser))) coin.dy = 0 - coin.dy;

        coin.x += (coin.dx);
        coin.y += (coin.dy);

        coin.x = Math.max(0, Math.min(Spielfeld.width - coin.Durchmesser, coin.x));
        coin.y = Math.max(0, Math.min(Spielfeld.height - coin.Durchmesser, coin.y));
    }


}





function Collision() {

    coin.Lifetime += 1;

    if (coin.Aktiv == true) {

        document.getElementById("Z1").innerHTML = coin.Lifetime / 100;

        if ((((player.x < coin.x)&&(coin.x - player.x < player.Durchmesser))||((coin.x < player.x)&&(player.x - coin.x < coin.Durchmesser)))&&(((player.y < coin.y)&&(coin.y - player.y < player.Durchmesser))||((coin.y < player.y)&&(player.y - coin.y < coin.Durchmesser)))) {

            coin.Aktiv = false;


            if (document.getElementById("Z2").innerHTML == 0 || Speicher.Highscore > coin.Lifetime) {
                document.getElementById("Z2").innerHTML = coin.Lifetime / 100; Speicher.Highscore = coin.Lifetime;

            }
            Speicher.cash += coin.Wert;


            document.getElementById("Cash").innerHTML = Speicher.cash;

            coin.Lifetime = 0;

            localStorage.setItem("Save", JSON.stringify(Speicher));

        }

    } else          {
        if (coin.Lifetime == 100) {
            coin.Lifetime = 0;
            coin.Aktiv = 1;

            coin.x = Math.floor(Math.random() * (Spielfeld.width - coin.Durchmesser));
            coin.y = Math.floor(Math.random() * (Spielfeld.height - coin.Durchmesser));

            if (Math.random() < 0.5) coin.dx = 0 - coin.dx;
            if (Math.random() < 0.5) coin.dy = 0 - coin.dy;

            if (Math.random() < 0.4) {
                while (Math.random() < 0.4) {
                    document.getElementById("Canvas").style.border = "16px solid #4080FF";

                    if (Math.random() < 0.5) {
                        player.speed *= (Math.round(Math.random() * 100) / 100);

                        document.getElementById("Playerspeed").innerHTML = Math.round( 50 * player.speed) / 100;
                    } else                   {
                        coin.dx *= 1 + Math.round(Math.random() * 100) / 100;
                        coin.dy *= 1 + Math.round(Math.random() * 100) / 100;
                        document.getElementById("Coinspeed").innerHTML = Math.round( 100 * Math.abs(coin.dx / 2)) / 100;
                    }
                }
            } else                  {

                document.getElementById("Playerspeed").innerHTML = 1;
                document.getElementById("Coinspeed").innerHTML = 1;

            }

        }

    }

}





function Draw() {
    ctx.fillStyle = "#FF0000";

    ctx.fillRect(player.x, player.y, player.Durchmesser, player.Durchmesser);

    if (coin.Aktiv == true) {

        if (coin.shield) {
            ctx.fillStyle = "#5555FF";
            ctx.fillRect(coin.x, coin.y, coin.Durchmesser, coin.Durchmesser);
            }
        }
}



function clear() {
    ctx.clearRect(0, 0, Spielfeld.width, Spielfeld.height);
}





function gameLoop() {
    if (Pause == false) {
        update();
        Collision();
        clear();
        Draw();
        update();
    } else      {
        Draw();
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key == "Escape") Pause = !(Pause);
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

gameLoop();