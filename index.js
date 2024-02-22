const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var off = 'rgb(25,25,25)', on = 'rgb(70,70,70)';
var nH = 0, nW = 0;
var w = 4, g = 2;
var iX = 0, iY = 0;
var arr;

class Cell {
    constructor (X,Y) {
        this.x = X;
        this.y = Y;
        this.state = Math.round(Math.random());
        this.next = 2;
        // this.state = 0;
    }
    update (i,j) {
        // this.state = Math.round(Math.random());
        // CONDITIONS
        var n = 0;
        // if(i>0) n += arr[i-1][j].state;
        // if(j>0) n += arr[i][j-1].state;
        // if(i<nH-1) n += arr[i+1][j].state;
        // if(j<nW-1) n += arr[i][j+1].state;

        for(var v=-1;v<=1;v++){
            for(var h=-1;h<=1;h++){
                if(!v && !h) continue;
                if(i+v>=0 && i+v<nH && j+h>=0 && j+h<nW) n += arr[i+v][j+h].state;
            }
        }
        
        var cur = this.state;
        // if(cur) console.log('i : ',i,' :: j : ',j);
        // if(cur) console.log('n : ',n,' :: cur : ',cur);
        this.next = 0;
        if(cur && (n==2 || n==3)) this.next = 1;
        else if(!cur && n==3) this.next = 1;
    }
    draw () {
        if(this.next == 2) this.next = this.state;
        this.state = this.next;
        this.next = 0;
        this.state ? ctx.fillStyle = on : ctx.fillStyle = off;
        ctx.fillRect(this.x,this.y,w,w);
    }
    random () {
        this.state = Math.round(Math.random());
        this.next = 2;
    }
    clear () {
        this.state = 0;
    }
}

function calculateNew(W,H) {
    nH = Math.ceil((H+g)/parseFloat(w+g));
    nW = Math.ceil((W+g)/parseFloat(w+g));
    iX = ((W+g)%(w+g));
    iY = ((H+g)%(w+g));
    console.log("nH : ",nH);
    console.log("nW : ",nW);
    console.log("iX : ",iX);
    console.log("iY : ",iY);
}

function fillArray () {
    arr = new Array(nH);
    for(var i=0;i<nH;i++){
        arr[i] = new Array(nW);
        for(var j=0;j<nW;j++){
            arr[i][j] = new Cell(j*(w+g)-iX,i*(w+g)-iY);
            arr[i][j].draw();
        }
    }
}

function updateArray () {
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            arr[i][j].update(i,j);
        }
    }
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            arr[i][j].draw();        
        }
    }
}
function randomArray () {
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            arr[i][j].random();
            arr[i][j].draw();
        }
    }
}
function clearArray () {
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            arr[i][j].clear();
            arr[i][j].draw();
        }
    }
}

function draw () {
    console.log("WIDTH : ",canvas.width);
    console.log("HEIGHT : ",canvas.height);

    calculateNew(canvas.width,canvas.height);
    fillArray();
    // updateArray();
    // initialShape();
};

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();

})

canvas.addEventListener('click', function(event) {
    var x = event.x;
    var y = event.y;

    var ix = Math.ceil((x+g-iX)/(w+g));
    var iy = Math.ceil((y+g-iY)/(w+g));

    arr[iy][ix].state = 1-arr[iy][ix].state;
    arr[iy][ix].next = 2;
    arr[iy][ix].draw();
    // console.log("ix : ",ix, " :: iy : ",iy);
});

draw();

var timer = null;
var toggle = 1;
document.addEventListener("keypress", function(event) {
    // console.log('code : ',event.keyCode);
    if(event.keyCode == 32) {
        console.log("TOGGLE : ",toggle);
        if(toggle) {
            timer = setInterval(updateArray,100);
            document.body.style.backgroundColor = 'rgb(0,0,0)';
        }
        else {
            clearInterval(timer);
            document.body.style.backgroundColor = 'rgb(21, 2, 51)';
        }
        toggle = 1-toggle;
    }
    else if(event.keyCode == 114) {
        randomArray();
    }
    else if(event.keyCode == 99) {
        clearArray();
    }
});