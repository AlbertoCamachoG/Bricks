//modelo
var svg = document.getElementsByTagName("svg")[0];
var te = document.createElementNS("http://www.w3.org/2000/svg", "text");
te.setAttributeNS(null, "x", 450);
te.setAttributeNS(null, "y", 300);
te.setAttributeNS(null, "id", "instr");
te.setAttributeNS(null, "fill", "white");
te.setAttributeNS(null, "width", 1000);
te.setAttributeNS(null, "height", 100);
svg.appendChild(te);
var coso=document.getElementById("instr");
coso.innerHTML="Esc: Pause |-| Space: Hit upwards |-| Arrows/(a,d): movement";

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
        this.endurance=Math.round(Math.random()*5);
        this.color;
        if(this.endurance==5)this.endurance=3;else{
            if(this.endurance==4||this.endurance==3){
                this.endurance=2;
            }else{this.endurance=1}
        }

        if(this.endurance==3)this.color="red";
        if(this.endurance==2)this.color="blue";
        if(this.endurance==1)this.color="white";

        var bri = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bri.setAttributeNS(null, "x", this.posX);
        bri.setAttributeNS(null, "y", this.posY);
        bri.setAttributeNS(null, "width", this.width);
        bri.setAttributeNS(null, "id", this.id);
        bri.setAttributeNS(null, "height", this.height);
        bri.setAttributeNS(null, "fill", this.color);
        bri.setAttributeNS(null, "rx", 15);
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
    constructor(r) {
        this.svg = document.getElementsByTagName("svg")[0];
        this.posX = this.svg.width.animVal.value / 2;
        if (this.posX == 0) this.posX = 600;
        this.posY = this.svg.height.animVal.value - 200;
        this.incX = 0.5;
        this.incY = -1;
        this.radio = r;
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
                if (juego.bola.incX == 0) {
                    if (Math.round(Math.random()) == 1) {
                        juego.bola.incX = 1;
                    } else {
                        juego.bola.incX = -1;
                    }
                }
            }
            pintar(this.posX, this.posY);
            if (this.posY == this.radio) {
                this.incY *= -1;
            }

            //SI SE HA COLADO POR ABAJO
            if (this.posY > this.svg.height.animVal.value) {
                if (juego.jugador.vidas > 0) {
                    juego.jugador.vidas--;
                    document.getElementById("p").innerText = "Vidas Restantes: " + juego.jugador.vidas;
                    this.posX = this.svg.width.animVal.value / 2;
                    this.posY = this.svg.height.animVal.value - 200;
                    this.incY = -1;
                    if(this.posX == this.svg.width.animVal.value / 2&&this.posY == this.svg.height.animVal.value - 200){
                        pintar(this.posX,this.posY);
                        clearInterval(interval);
                    }

                    setTimeout(function () { interval = setInterval(anima, 60);pausa=false; }, 3000);

                } else {
                    juego.jugador.perder();
                }
            }
            //CHOCAR PALO
            if (this.posY + this.radio > juego.palo.posY && this.posY - this.radio < juego.palo.posY + document.getElementById("palo").height.animVal.value && this.posX + this.radio > document.getElementById("palo").x.animVal.value && this.posX - this.radio < document.getElementById("palo").x.animVal.value + document.getElementById("palo").width.animVal.value) {
                this.posY = juego.palo.posY - this.radio;
                pintar(this.posX, this.posY);
                this.incY *= -1;
                if (juego.bola.incX == 0) {
                    if (Math.round(Math.random()) == 1) {
                        juego.bola.incX = 1;
                    } else {
                        juego.bola.incX = -1;
                    }
                }
                if (juego.palo.posY - 10 == document.getElementById("palo").y.animVal.value) juego.bola.incX = 0;
            }
        }
    }
    choqueBrick(brick, n) {
        var points = Array(false, false, false, false);
        for (var i = 0; i <= 3; i++) {
            if (brick.isInside(juego.bola.puntos[i])) {
                points[i] = true;
            }
        }
            if (points[0] || points[1] || points[2] || points[3]) {
                brick.endurance--;
                if (points[0]) {juego.bola.posY=brick.posY+brick.height+juego.bola.radio;pintar(juego.bola.posX,juego.bola.posY);juego.bola.incY*=-1;}
                if (points[1]) {juego.bola.posX=brick.posX-juego.bola.radio;pintar(juego.bola.posX,juego.bola.posY);juego.bola.incX*=-1;}
                if (points[2]) {juego.bola.posY=brick.posY-juego.bola.radio;pintar(juego.bola.posX,juego.bola.posY);juego.bola.incY*=-1;}
                if (points[3]) {juego.bola.posX=brick.posX+brick.width+juego.bola.radio;pintar(juego.bola.posX,juego.bola.posY);juego.bola.incX*=-1;}
                var aux=document.getElementById(brick.id);
                
                if(brick.endurance==0){
                    if(aux)aux.remove();
                    if(aux)arr.splice(n, 1);
                    if (arr.length == 0) {
                        juego.jugador.ganar();
                    }
                }else{
                    if(brick.endurance==1){aux.setAttributeNS(null, "fill", "white");}
                    if(brick.endurance==2){aux.setAttributeNS(null, "fill", "blue");}
                }
                points[0]=false;
                points[1]=false;
                points[2]=false;
                points[3]=false;
            }
        }
    }

class Palo {
    constructor(w,h) {
        this.posX = "600";
        this.posY = document.getElementsByTagName("svg")[0].height.animVal.value - 100;
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttributeNS(null, "x", this.posX);
        rect.setAttributeNS(null, "y", this.posY);
        rect.setAttributeNS(null, "width", w);
        rect.setAttributeNS(null, "height", h);
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
            if (event.key == "a" || event.key == "A" || event.key == "ArrowLeft" && pausa==false && this.posX>0) {
                this.posX -= 40;
                aPalo.setAttribute("x", this.posX);
            }
            if (event.key == "d" || event.key == "D" || event.key == "ArrowRight" && pausa==false && this.posX<1200) {
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
        document.getElementById("bola").remove();
        document.getElementById("palo").remove();
        alert("ganas");
        clearInterval(interval);
        svg.style.backgroundImage = "url(ganar.jpg)";
    }
    perder() {
        
        
        document.getElementById("bola").remove();
        document.getElementById("palo").remove();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i])
                document.getElementById(arr[i].id).remove();
        }
        alert("pierdes");
        clearInterval(interval);

        svg.style.backgroundImage = "url(perder.jpg)";
    }
}
//vista
function pintar(x, y) {
    document.getElementById("bola").setAttribute("cx", x);
    document.getElementById("bola").setAttribute("cy", y);
}
//bucle animacion
function anima() {
    juego.bola.mover();
    bricks();
}
//controlador
function createBricks(n, v) {
    let x = 0;
    let y = 20;
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
        juego.bola.choqueBrick(arr[i], i);
    }
}
class Game{
    constructor(paloW,paloH,bolaR,bricksRow,bricksColumns){
        this.bola = new Bola(bolaR);
        this.palo = new Palo(paloW,paloH);
        this.jugador = new Player();
        createBricks(bricksColumns, bricksRow);
    }
}
var juego;
setTimeout(function () {coso.remove();juego=new Game(150,20,10,5,11);}, 3000);
