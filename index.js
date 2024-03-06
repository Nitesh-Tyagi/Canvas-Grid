const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var off = 'rgb(240,240,240)', on = 'rgb(70,70,70)';
var theme1 = 'white', theme2 = 'rgb(240,240,240)';
var nH = 0, nW = 0;
var w = 4, g = 2;
var iX = 0, iY = 0;
var arr;

var gosperGliderGun =   [
                            [0,24],[1,22],[1,24],
                            [2,12],[2,13],[2,20],[2,21],[2,34],[2,35],
                            [3,11],[3,15],[3,20],[3,21],[3,34],[3,35],
                            [4,0],[4,1],[4,10],[4,16],[4,20],[4,21],
                            [5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],
                            [6,10],[6,16],[6,24],
                            [7,11],[7,15],
                            [8,12],[8,13]
                        ];

class Cell {
    constructor (X,Y) {
        this.x = X;
        this.y = Y;
        this.state = Math.round(Math.random());
        this.next = 2;
        this.color = on;
    }
    update (i,j) {
        var n = 0;

        for(var v=-1;v<=1;v++){
            for(var h=-1;h<=1;h++){
                if(!v && !h) continue;
                if(i+v>=0 && i+v<nH && j+h>=0 && j+h<nW) n += arr[i+v][j+h].state;
            }
        }
        
        var cur = this.state;
        this.next = 0;
        if(cur && (n==2 || n==3)) this.next = 1;
        else if(!cur && n==3) this.next = 1;
    }
    draw () {
        var remain = 0;
        if(this.next == 2) this.next = this.state;
        else if(this.state && this.state == this.next) remain = 1; 
        this.state = this.next;
        if(this.next==2) this.state ? ctx.fillStyle = on : ctx.fillStyle = off;
        else if(!this.state) ctx.fillStyle = off;
        else if(remain) ctx.fillStyle = this.color;
        else {
            var hue = (Math.floor(Date.now() / 20))%360;
            // console.log(hue);
            var c = 'hsl('+ hue +',50%,50%)';
            
            // var c = on;
            ctx.fillStyle =  c;
            this.color = c;
        }
        this.next = 0;
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

function updateTheme() {
    document.body.style.backgroundColor = theme1;
    off = theme2;
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
};

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();

})

// canvas.addEventListener('click', function(event) {
//     var x = event.x;
//     var y = event.y;

//     var ix = Math.ceil((x+g-iX)/(w+g));
//     var iy = Math.ceil((y+g-iY)/(w+g));

//     arr[iy][ix].state = 1-arr[iy][ix].state;
//     arr[iy][ix].next = 2;
//     arr[iy][ix].draw();
// });

let isDragging = false;
let lastToggled = { ix: null, iy: null };

function trackLocation(event) {
    if (isDragging) {
        var x = event.x;
        var y = event.y;

        var ix = Math.ceil((x+g-iX)/(w+g));
        var iy = Math.ceil((y+g-iY)/(w+g));

        if (lastToggled.ix === ix && lastToggled.iy === iy) {
            return;
        }

        lastToggled = { ix, iy };

        if (arr[iy] && arr[iy][ix]) {
            arr[iy][ix].state = 1-arr[iy][ix].state;
            arr[iy][ix].next = 2;
            arr[iy][ix].draw();
        }
    }
}
canvas.addEventListener('mousedown', function(event) {
    isDragging = true;
    lastToggled = { ix: null, iy: null };
    trackLocation(event);
});
document.addEventListener('mousemove', trackLocation);
document.addEventListener('mouseup', function() {
    isDragging = false;
});

draw();

var timer = null;
var toggle = 1;

function Key_Spacebar () {
    console.log("TOGGLE : ",toggle);
    if(toggle) {
        timer = setInterval(updateArray,50);
        if(theme1=='white') document.body.style.backgroundColor = 'white';
        else document.body.style.backgroundColor = 'black';
    }
    else {
        clearInterval(timer);
        document.body.style.backgroundColor = theme1;
    }
    toggle = 1-toggle;
}
function Key_Clear () {
    clearArray();
}
function Key_Random () {
    randomArray();
}
function Key_Machines () {
    clearArray();
    var y = 29;
    var x = 53;
    var s = 0;

    var count = 0;
    for(var yy=5;yy<nH-y;yy+=y) {
        if(count>=2) break;
        for(var xx=5+s;xx<nW-x;xx+=x) {
            console.log(yy," : ",xx);
            if(xx<0) continue;
            for(var i=0;i<gosperGliderGun.length;i++){
                arr[gosperGliderGun[i][0]+yy][gosperGliderGun[i][1]+xx].state = 1;
                arr[gosperGliderGun[i][0]+yy][gosperGliderGun[i][1]+xx].next = 2;
                arr[gosperGliderGun[i][0]+yy][gosperGliderGun[i][1]+xx].draw();
            }
        }
        s+=1;
        count++;
    }
}
function Key_Map () {
    var minI = 999999999;
    var minJ = 999999999;
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            if(arr[i][j].state){
                minI = Math.min(i,minI);
                minJ = Math.min(j,minJ);
            }       
        }
    }
    for(var i=0;i<nH;i++){
        for(var j=0;j<nW;j++){
            if(arr[i][j].state)  console.log("[ ",i-minI,",",j-minJ," ]");       
        }
    }
}
function Key_Light () {
    theme1 = 'white';
        // theme2 = 'rgb(240,240,240)';
        theme2 = 'white';
        updateTheme();
}
function Key_Dark () {
    theme1 = 'rgb(21, 2, 51)';
    theme2 = 'rgb(25,25,25)';
    updateTheme();
}

document.addEventListener("keypress", function(event) {
    // Spacebar - start/stop
    if(event.keyCode == 32) {
        Key_Spacebar();
    }
    // C - clear grid
    else if(event.keyCode == 99) {
        Key_Clear();
    }
    // R - random grid
    else if(event.keyCode == 114) {
        Key_Random();
    }
    // N - draw machines
    else if(event.keyCode == 110) {
        Key_Machines();
    }
    // M - map out
    else if(event.keyCode == 109) {
        Key_Map();
    }
    // W - light theme
    else if(event.keyCode == 119) {
        Key_Light();
    }
    // B - dark theme
    else if(event.keyCode == 98) {
        Key_Dark();
    }
    else console.log("KEY : ",event.keyCode);
});

function toggleController(event) {
    if(event.target.classList.contains('right')) return;
    if(controller.classList.contains('on')) {
        controller.classList.remove('on');
        controller.classList.add('off');
    }
    else {
        controller.classList.remove('off');
        controller.classList.add('on');
    };
};

var controller = document.getElementById("controller");
controller.addEventListener('click',function(event) {
    toggleController(event);
});

document.getElementById('Spacebar').addEventListener('click',Key_Spacebar);
document.getElementById('Clear').addEventListener('click',Key_Clear);
document.getElementById('Random').addEventListener('click',Key_Random);
document.getElementById('Machines').addEventListener('click',Key_Machines);
document.getElementById('Map').addEventListener('click',Key_Map);
document.getElementById('Light').addEventListener('click',Key_Light);
document.getElementById('Dark').addEventListener('click',Key_Dark);

var isContDragging = false;
var dragOffsetX, dragOffsetY;

// Function to start the dragging
function startDrag(e) {
    // Use 'touches[0]' for touch events and 'e' for mouse events
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;

    isContDragging = true;
    dragOffsetX = clientX - controller.getBoundingClientRect().left;
    dragOffsetY = clientY - controller.getBoundingClientRect().top;
    controller.style.cursor = 'grabbing';
}

// Function to perform the dragging
function doDrag(e) {
    if (!isContDragging) return;
    // Prevent the default touch action to avoid scrolling during drag
    e.preventDefault();

    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;

    controller.style.left = (clientX - dragOffsetX) + 'px';
    controller.style.top = (clientY - dragOffsetY) + 'px';
    // Call toggleController here if necessary, ensure it's compatible with touch
    // toggleController(e);
}

// Function to end the dragging
function endDrag() {
    if (isContDragging) {
        isContDragging = false;
        controller.style.cursor = 'pointer';
    }
}

// Attach mouse event listeners
controller.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('mouseup', endDrag);

// Attach touch event listeners
controller.addEventListener('touchstart', startDrag, {passive: false});
document.addEventListener('touchmove', doDrag, {passive: false});
document.addEventListener('touchend', endDrag);
