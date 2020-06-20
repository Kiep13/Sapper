const HEIGHT = 10;
const WIDTH = 10;
const AVAILABLE_FLAGS = 10;

let valueArray = [];

let bombArray = [];
let flagsArray = [];

let startPoint;

document.addEventListener("DOMContentLoaded", function(event) {

    document.addEventListener('contextmenu', event => event.preventDefault());

    let block = document.createElement('div');
    block.setAttribute('id', 'mainBlock');
    block.className = "card container mt-3";

    let internalBlock = document.createElement('div');
    internalBlock.setAttribute('id', 'internalBlock');
    internalBlock.classList.add('mx-auto','mt-3', 'mb-3');

    let table = document.createElement('table');
    table.setAttribute('id', 'sapperField');
    table.className = "table table-bordered mt-3 mb-3 sized-table";

    for (let i = 0; i < WIDTH; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < HEIGHT; j++) {
            let cell = document.createElement('td');
            cell.classList.add("cell", "align-middle", "closed-cell");

            cell.setAttribute('id', 'row' + i + 'col' +j)
            cell.onclick = () => {
                startPoint = new Cell(i ,j);
                startPoint.solvePositionStatus(WIDTH, HEIGHT);
                renderField()
            };

            row.append(cell);
        }
        table.append(row);
    }

    let counterFlag = document.createElement('div');
    counterFlag.setAttribute('id', 'counterFlagBlock');
    counterFlag.classList.add('mb-3', 'float-left', 'counterFlag');

    let pic = document.createElement('img');
    pic.setAttribute('src', 'images/flag.png');
    pic.setAttribute('alt', 'bomb');
    pic.classList.add('iconFlag');

    let amount = document.createElement('p');
    amount.innerHTML = AVAILABLE_FLAGS - flagsArray.length;

    counterFlag.append(pic);
    counterFlag.append(amount);


    let button = document.createElement('input');
    button.classList.add('btn', 'btn-info', 'mb-3', 'float-right');
    button.setAttribute('value', 'Reset');
    button.setAttribute('type', 'button');
    button.onclick = restart;

    internalBlock.append(table);
    internalBlock.append(button);
    internalBlock.append(counterFlag);

    block.append(internalBlock);

    document.body.append(block);
});

function renderField() {

    for (let i = 0; i < WIDTH; i++) {
        for(let j = 0; j < HEIGHT; j++) {
            let cell = new Cell(i, j);
            cell.solvePositionStatus(WIDTH, HEIGHT);
            valueArray.push(cell);
        }
    }

    generateBombPlaces(0, (WIDTH * HEIGHT) - 1);

    for(let i = 0; i < bombArray.length; i++){
        valueArray[bombArray[i]].value = "B";
    }

    for(let i = 0; i < (WIDTH * HEIGHT); i++) {
        if(!valueArray[i].isBomb()) {
            valueArray[i].solveValue(bombArray);
        }
    }

    for(let i = 0; i < WIDTH; i++) {
        for(let j = 0; j < HEIGHT; j++) {

            let cell = document.getElementById('row' + i + 'col' + j);

            let currentPosition = i*10 + j;

            if(valueArray[currentPosition].isEmpty()) {
                cell.onclick = (() => {
                    openCells(i, j);
                })
            } else if (valueArray[currentPosition].isBomb()) {
                cell.onclick = (() => {
                    clickOnBomb();
                })
            } else {
                cell.onclick = (() => {
                    showCell(i, j);
                });
            }
            cell.oncontextmenu = (() => {
                putFlag(i,j);
            })
        }
    }

    openCells(startPoint.xCoordinate, startPoint.yCoordinate);
}

function generateBombPlaces(min, max) {

    for(let i = 0; i < AVAILABLE_FLAGS; i++) {
        let rand = min + Math.random() * (max + 1 - min);
        let value = Math.floor(rand);

        if(isNearbyStartPoint(value) || bombArray.includes(value)) {
            i--;
        } else {
            bombArray.push(value);
        }
    }
}

function isNearbyStartPoint(bombPosition) {

    let coordinates = startPoint.solveCurrentPosition();

    if(coordinates === bombPosition) return true;

    if(startPoint.positionStatus.includes('N')) {
        if(coordinates - 10 === bombPosition) return true;

        if(startPoint.positionStatus.includes('W')) {
            if(coordinates - 11 === bombPosition) return true;
        }

        if(startPoint.positionStatus.includes('E')) {
            if(coordinates - 9 === bombPosition) return true;
        }
    }

    if(startPoint.positionStatus.includes('E')) {
        if(coordinates + 1 === bombPosition) return true;
    }

    if(startPoint.positionStatus.includes('S')) {
        if(coordinates + 10 === bombPosition) return true;

        if(startPoint.positionStatus.includes('W')) {
            if(coordinates + 9 === bombPosition) return true;
        }

        if(startPoint.positionStatus.includes('E')) {
            if(coordinates + 11 === bombPosition) return true;
        }
    }

    if(startPoint.positionStatus.includes('W')) {
        if(coordinates - 1 === bombPosition) return true;
    }

    return false;
}

function openCells(i, j) {

    if(!valueArray[i*10 + j].isCalled) {

        if(!valueArray[i*10 + j].isBomb()) {
            showCell(i, j)
        }

        if(valueArray[i*10 + j].isEmpty()) {

            if(i  > 0 ) openCells(i-1, j);

            if(j < HEIGHT - 1) openCells(i, j+1);

            if(i < WIDTH - 1) openCells(i+1, j);

            if(j > 0) openCells(i, j-1);

        }
    }
}

function showCell(i, j) {

    let cell = document.getElementById('row' + i + 'col' +j);
    cell.onclick = null;
    cell.oncontextmenu = null;

    let style = "cell" + valueArray[i*10 + j].value;
    cell.classList.add(style);

    valueArray[i*10 + j].isCalled = true;

    if(!valueArray[i*10 + j].isEmpty() && !valueArray[i*10 + j].isBomb()) {
        clearCell(cell);
        cell.classList.remove('flagged');
        let value = document.createElement('p');
        value.innerHTML = valueArray[i*10 + j].value;
        value.classList.add("mb-0");
        cell.append(value);
    } else if (valueArray[i * 10 + j].isBomb()) {
        clearCell(cell);
        setIconPic(cell, 'images/bomb.png', 'bomb');
    }
}

function clearCell(cell) {
    while(cell.firstChild) {
        cell.firstChild.remove();
    }
}

function setIconPic(cell, icon, alt) {
    let pic = document.createElement('img');
    pic.setAttribute('src', icon);
    pic.setAttribute('alt', alt);
    pic.classList.add('icon');
    cell.append(pic);
}

function putFlag(i, j) {

    if(flagsArray.length < AVAILABLE_FLAGS ) {
        let cell = document.getElementById('row' + i + 'col' +j);
        cell.classList.add('flagged');

        setIconPic(cell, 'images/flag.png', 'flag');

        cell.oncontextmenu = (() => {
            removeFlag(i,j);
        })

        flagsArray.push(i*10 + j);

        changeCounterFlag();

        if(compareFlagsAndBombs()) {
            openAllField();
            setResultLogo('images/winLogo.png', 'You win', '-400px');
        }
    }
}

function compareFlagsAndBombs() {
    if(bombArray.length !== flagsArray.length) {
        return false;
    }

    for(let i = 0; i < bombArray.length; i++){
        if(!flagsArray.includes(bombArray[i])) return false;
    }

    return true;
}

function removeFlag(i, j) {
    let cell = document.getElementById('row' + i + 'col' +j);
    cell.classList.remove('flagged');

    clearCell(cell);
    cell.classList.remove('flagged');

    cell.oncontextmenu = (() => {
        putFlag(i,j);
    })
    let index = flagsArray.findIndex(element => element === (i*10 + j));
    flagsArray.splice(index, 1);

    changeCounterFlag();
}

function changeCounterFlag() {
    let counterFlag = document.getElementById('counterFlagBlock');
    counterFlag.lastChild.remove();
    let amount = document.createElement('p');
    amount.innerHTML = AVAILABLE_FLAGS - flagsArray.length;
    counterFlag.append(amount);
}

function clickOnBomb() {

    for(let i = 0; i < bombArray.length; i++){
        let coordinates = bombArray[i];
        let x_coordinate = Math.floor(coordinates/10);
        let y_coordinate = coordinates % 10;
        showCell(x_coordinate, y_coordinate);
    }

    cleanAllClickListener();

    setResultLogo('images/lostPic.png', 'You died', '-200px');
}

function openAllField() {

    for(let i = 0; i < WIDTH; i++) {
        for(let j = 0; j < HEIGHT; j++) {
            let cell = document.getElementById('row' + i + 'col' +j);
            cell.onclick = null;
            cell.oncontextmenu = null;

            if(!valueArray[i*10 + j].isCalled) {
                showCell(i, j);
            }
        }
    }

}

function cleanAllClickListener() {

    for(let i = 0; i < WIDTH; i++) {
        for(let j = 0; j < HEIGHT; j++) {
            let cell = document.getElementById('row' + i + 'col' +j);
            cell.onclick = null;
            cell.oncontextmenu = null;
        }
    }
}

function setResultLogo(pictureName, alt, marginTop) {
    let block = document.getElementById('mainBlock');
    let pic = document.createElement('img');
    pic.setAttribute('src', pictureName);
    pic.setAttribute('alt', alt);
    pic.style.marginTop = marginTop;
    pic.classList.add('died-pic');
    block.append(pic);
}

function restart() {
    location.reload();
}

class Cell {

    value;
    xCoordinate;
    yCoordinate;
    positionStatus;
    isCalled;

    constructor(xCoordinate, yCoordinate) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.isCalled = false;
    }

    solvePositionStatus(WIDTH, HEIGHT) {
        this.positionStatus = '';

        if(this.xCoordinate !== 0) {
            this.positionStatus = this.positionStatus + 'N';
        }

        if(this.yCoordinate !== WIDTH - 1) {
            this.positionStatus = this.positionStatus + 'E';
        }

        if(this.xCoordinate !== HEIGHT - 1) {
            this.positionStatus = this.positionStatus + 'S';
        }

        if(this.yCoordinate !== 0) {
            this.positionStatus = this.positionStatus + 'W';
        }
    }

    solveValue(bombArray) {

        let counter = 0;
        let currentPosition = this.solveCurrentPosition();

        if(this.positionStatus.includes('N')) {
            if(bombArray.includes(currentPosition - 10)) counter++;

            if(this.positionStatus.includes('W')) {
                if(bombArray.includes(currentPosition - 11)) counter++;
            }

            if(this.positionStatus.includes('E')) {
                if(bombArray.includes(currentPosition - 9)) counter++;
            }
        }

        if(this.positionStatus.includes('E')) {
            if(bombArray.includes(currentPosition + 1)) counter++;
        }

        if(this.positionStatus.includes('S')) {
            if(bombArray.includes(currentPosition + 10)) counter++;

            if(this.positionStatus.includes('W')) {
                if(bombArray.includes(currentPosition + 9)) counter++;
            }

            if(this.positionStatus.includes('E')) {
                if(bombArray.includes(currentPosition + 11)) counter++;
            }
        }

        if(this.positionStatus.includes('W')) {
            if(bombArray.includes(currentPosition - 1)) counter++;
        }

        this.value = counter;

    }

    solveCurrentPosition() {
        return this.xCoordinate * 10 + this.yCoordinate;
    }

    isBomb() {
        return this.value === 'B';
    }

    isEmpty() {
        return this.value === 0;
    }
}
