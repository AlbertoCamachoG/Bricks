//modelo
var arr = [];
var pausa=false;
var interval;
setTimeout(function () { interval = setInterval(anima, 60); pausa=false;}, 3000);



class Bricks {
    constructor(x, y, id) {
        this.posX = 230 + x;
        this.posY = y;
        this.width = 70;
        this.height = 30;
        this.id = id;

        var bri = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bri.setAttributeNS(null, "x", this.posX);
        bri.setAttributeNS(null, "y", this.posY);
        bri.setAttributeNS(null, "width", this.width);
        bri.setAttributeNS(null, "id", this.id);
        bri.setAttributeNS(null, "height", this.height);
        bri.setAttributeNS(null, "fill", "white");
        this.svg = document.getElementsByTagName("svg")[0];
        this.svg.appendChild(bri);
    }
    isInside(ps) {
        if (ps.x > this.posX && ps.x < this.posX + this.width && ps.y > this.posY && ps.y < this.posY + this.height) {

            return true;
        } else {
            return false;
        }
    }
}

class Punto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Bola {
    constructor() {
        this.svg = document.getElementsByTagName("svg")[0];
        this.posX = this.svg.width.animVal.value / 2;
        if (this.posX == 0) this.posX = 600;
        this.posY = this.svg.height.animVal.value - 200;
        this.incX = 1;
        this.incY = -1;
        this.radio = 10;
        this.puntos = Array(new Punto(this.posX, this.posY - this.radio), new Punto(this.posX + this.radio, this.posY), new Punto(this.posX, this.posY + this.radio), new Punto(this.posX - this.radio, this.posY));

        var circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circ.setAttributeNS(null, "cx", this.posX);
        circ.setAttributeNS(null, "cy", this.posY);
        circ.setAttributeNS(null, "r", this.radio);
        circ.setAttributeNS(null, "id", "bola");
        circ.setAttributeNS(null, "fill", "white");
        this.svg.appendChild(circ);
    }
    //CHOCAR CON LOS BORDES EN LA X
    mover() {
        this.puntos[0].x = this.posX;
        this.puntos[0].y = this.posY - this.radio;
        this.puntos[1].x = this.posX + this.radio;
        this.puntos[1].y = this.posY;
        this.puntos[2].x = this.posX;
        this.puntos[2].y = this.posY + this.radio;
        this.puntos[3].x = this.posX - this.radio;
        this.puntos[3].y = this.posY;
        for (var i = 0; i <= 10; i++) {
            //CHOCAR BORDE DERECHA
            var svgW = this.svg.width.animVal.value - this.radio;
            this.posX += this.incX;
            this.posY += this.incY;
            if (this.posX > svgW) { this.posX = svgW; }
            if (this.posX == svgW) {
                this.incX *= -1;
            }
            //CHOCAR BORDE IZQUIERDA
            if (this.posX - this.radio < 0) { this.posX = 0 + this.radio; }
            if (this.posX == 0 + this.radio) {
                this.incX *= -1;
            }
            //CHOCAR ARRIBA
            if (this.posY < this.radio) {
                this.posY = this.radio;
                if (bola.incX == 0) {
                    if (Math.round(Math.random()) == 1) {
                        bola.incX = 1;
                    } else {
                        bola.incX = -1;
                    }
                }
            }
            pintar(this.posX, this.posY);
            if (this.posY == this.radio) {
                this.incY *= -1;
            }

            //SI SE HA COLADO POR ABAJO
            if (this.posY > this.svg.height.animVal.value) {
                if (jugador.vidas > 0) {
                    jugador.vidas--;
                    document.getElementById("p").innerText = "Vidas Restantes: " + jugador.vidas;
                    this.posX = this.svg.width.animVal.value / 2;
                    this.posY = this.svg.height.animVal.value - 200;
                    this.incY = -1;
                    setTimeout(function () { clearInterval(interval); }, 20);

                    setTimeout(function () { interval = setInterval(anima, 60);pausa=false; }, 3000);

                } else {
                    jugador.perder();
                }
            }
            //CHOCAR PALO
            if (this.posY + this.radio > palo.posY && this.posY - this.radio < palo.posY + document.getElementById("palo").height.animVal.value && this.posX + this.radio > document.getElementById("palo").x.animVal.value && this.posX - this.radio < document.getElementById("palo").x.animVal.value + document.getElementById("palo").width.animVal.value) {
                this.posY = palo.posY - this.radio;
                pintar(this.posX, this.posY);
                this.incY *= -1;
                if (bola.incX == 0) {
                    if (Math.round(Math.random()) == 1) {
                        bola.incX = 1;
                    } else {
                        bola.incX = -1;
                    }
                }
                if (palo.posY - 10 == document.getElementById("palo").y.animVal.value) bola.incX = 0;
            }
        }
    }
    choqueBrick(brick, n) {
        var points = Array(false, false, false, false);
        for (var i = 0; i <= 3; i++) {
            if (brick.isInside(bola.puntos[i])) {
                points[i] = true;
            }
            if (points[0] || points[1] || points[2] || points[3]) {
                if (points[0]) {bola.incY*=-1;}
                if (points[1]) {bola.incX*=-1;}
                if (points[2]) {bola.incY*=-1;}
                if (points[3]) {bola.incX*=-1;}

                var aux=document.getElementById(brick.id);
                if(aux)aux.remove();
                if(aux)arr.splice(n, 1);
                if (arr.length == 0) {
                    jugador.ganar();
                }
                points[0]=false;
                points[1]=false;
                points[2]=false;
                points[3]=false;
            }
        }
    }
}

class Palo {
    constructor() {
        this.posX = "600";
        this.posY = document.getElementsByTagName("svg")[0].height.animVal.value - 100;
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttributeNS(null, "x", this.posX);
        rect.setAttributeNS(null, "y", this.posY);
        rect.setAttributeNS(null, "width", 180);
        rect.setAttributeNS(null, "height", 20);
        rect.setAttributeNS(null, "id", "palo");
        rect.setAttributeNS(null, "fill", "white");
        document.getElementsByTagName("svg")[0].appendChild(rect);

        var aPalo = document.getElementById("palo");
        this.posX -= 40;
        aPalo.setAttribute("x", this.posX);
        document.addEventListener("keydown", event => {
            if (event.key == "Escape") {
                if(!pausa){
                    clearInterval(interval);
                    console.log(interval);
                    pausa=true;
                }else{
                    if(pausa){
                        interval = setInterval(anima, 60);
                        pausa=false;}
                }
            }
            if (event.key == " " && pausa==false) {
                aPalo.setAttribute("y", this.posY - 10);
                setTimeout(() => { aPalo.setAttribute("y", this.posY); }, 1000);

            }
            if (event.key == "a" || event.key == "A" || event.key == "ArrowLeft" && pausa==false) {
                this.posX -= 40;
                aPalo.setAttribute("x", this.posX);
            }
            if (event.key == "d" || event.key == "D" || event.key == "ArrowRight" && pausa==false) {
                this.posX += 40;
                aPalo.setAttribute("x", this.posX);
            }
        });

    }

}

class Player {
    constructor() {
        this.vidas = 3;
    }
    ganar() {
        bola.svg.style.backgroundColor = "green";
        document.getElementById("bola").remove();
        document.getElementById("palo").remove();
        alert("ganas");
        clearInterval(interval);

        var text = document.createElementNS('ttp://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, 'x', '10');
        text.setAttributeNS(null, 'y', '20');
        text.setAttributeNS(null, 'fill', '#000');
        text.textContent = 'HAS GANADO';
        bola.svg.appendChild(text);
    }
    perder() {
        bola.svg.style.backgroundColor = "red";
        document.getElementById("bola").remove();
        document.getElementById("palo").remove();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i])
                document.getElementById(arr[i].id).remove();
        }
        alert("pierdes");
        clearInterval(interval);

        var text = document.createElementNS('ttp://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '10');
        text.setAttribute('y', '20');
        text.setAttribute('fill', '#000');
        text.textContent = 'HAS PERDIDO';
        document.getElementsByTagName("svg")[0].appendChild(text);
    }
}
//vista
function pintar(x, y) {
    document.getElementById("bola").setAttribute("cx", x);
    document.getElementById("bola").setAttribute("cy", y);
}
//bucle animacion
function anima() {
    bola.mover();
    bricks();
}
//controlador
function createBricks(n, v) {
    let x = 0;
    let y = 10;
    for (var j = 0; j < v; j++) {
        for (var i = 0; i < n; i++) {
            arr.push(new Bricks(x, y, j + "" + i));
            x += 80;
        }
        y += 42;
        x = 0;
    }
}

function bricks() {
    for (var i = 0; i < arr.length; i++) {
        bola.choqueBrick(arr[i], i);
    }
}
var bola = new Bola();
var palo = new Palo();
var jugador = new Player();
createBricks(11, 5);