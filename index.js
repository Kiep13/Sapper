let width;
let height;
let amountOfBombs;

let isWidthError = true;
let isHeightError = true;
let isBombError = true;

let widthError;
let heightError;
let amountBombsError;

let inputWidth;
let inputHeight;
let inputBombs;

document.addEventListener("DOMContentLoaded", function(event) {

    document.addEventListener('contextmenu', event => event.preventDefault());

    let block = document.createElement('div');
    block.setAttribute('id', 'mainBlock');
    block.className = "card container mt-3";

    let form = document.createElement('form');
    form.classList.add('form-block', 'mt-4');

    let divWidth = document.createElement('div');
    divWidth.classList.add('form-group');

    let labelWidth = createLabel('width', 'Width of field');

    inputWidth = createInput('width', 'number');
    inputWidth.onchange = () => {
        isWidthError = checkNumericInput(inputWidth, widthError);
        isButtonDisabled();
    };

    widthError = createErrorField();

    divWidth.append(labelWidth)
    divWidth.append(inputWidth);
    divWidth.append(widthError);

    let divHeight = document.createElement('div');
    divHeight.classList.add('form-group');

    let labelHeight = createLabel('height', 'Height of field');

    inputHeight  = createInput('height', 'number');
    inputHeight.onchange = () => {
        isHeightError = checkNumericInput(inputHeight, heightError);
        isButtonDisabled();
    };

    heightError = createErrorField();

    divHeight.append(labelHeight);
    divHeight.append(inputHeight);
    divHeight.append(heightError);

    let divBombs = document.createElement('div');
    divBombs.classList.add('form-group');

    let labelBombs = createLabel('bombs', 'Amount of bombs');

    inputBombs = createInput('bombs', 'number');
    inputBombs.onchange = () => {
        isBombError = checkInputBombs(inputBombs, amountBombsError);
        isButtonDisabled();
    }

    amountBombsError = createErrorField();

    divBombs.append(labelBombs);
    divBombs.append(inputBombs);
    divBombs.append(amountBombsError);

    button = document.createElement('input');
    button.classList.add('btn', 'btn-success', 'mb-3', 'mt-3', 'float-right');
    button.setAttribute('value', 'Confirm');
    button.setAttribute('type', 'button');
    button.onclick = createTable;
    button.disabled = isWidthError && isHeightError && isBombError;

    form.append(divWidth);
    form.append(divHeight);
    form.append(divBombs);
    form.append(button);

    block.append(form);

    document.body.append(block);
});

function checkInput(input, errorField) {
    let value = input.value;

    if (value === '') {
        errorField.style.display = 'block';
        errorField.innerHTML = 'Empty value';
        input.classList.add('validation');
        return true;
    }

    if (!isNumeric(value)) {
        errorField.style.display = 'block';
        errorField.innerHTML = 'Invalid value';
        input.classList.add('validation');
        return true;
    }

    errorField.style.display = 'none';
    input.classList.remove('validation');
    return false;
}

function checkNumericInput(input, errorField) {

    if (checkInput(input, errorField)) {
        return true;
    }

    let value = input.value;

    if(value < 5 || value > 20) {
        errorField.style.display = 'block';
        errorField.innerHTML = 'The value must be in the range from 5 to 20';
        input.classList.add('validation');
        return true;
    }

    errorField.style.display = 'none';
    input.classList.remove('validation');
    return false;
}

function checkInputBombs(input, errorField) {

    if(checkInput(input, errorField)) {
        return true;
    }

    if(!isWidthError && !isHeightError) {
        let value = input.value;

        if(inputHeight.value * inputWidth.value / 5 < value) {
            errorField.style.display = 'block';
            errorField.innerHTML = 'Too much bombs';
            input.classList.add('validation');
            return true;
        }
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function createLabel(forId, innerHtml) {
    let label = document.createElement('label');
    label.setAttribute('for', forId);
    label.innerHTML = innerHtml;
    return label;
}

function createInput(id, type) {
    let input  = document.createElement('input');
    input.setAttribute('id', id);
    input.setAttribute('type', type);
    input.setAttribute('name', id);
    input.classList.add('form-control');
    return input;
}

function createErrorField() {
    let errorField = document.createElement('p');
    errorField.classList.add('validation');
    errorField.style.display = 'none';
    return errorField;
}

function isButtonDisabled() {
    button.disabled = isWidthError || isHeightError || isBombError;
}

let HEIGHT;
let WIDTH ;
let AVAILABLE_FLAGS;

let valueArray = [];

let bombArray = [];
let flagsArray = [];

let startPoint;

let sellSize;
let fontSize;

function createTable() {

    WIDTH = +inputWidth.value;
    HEIGHT = +inputHeight.value;
    AVAILABLE_FLAGS = +inputBombs.value;

    bombArray = [];
    valueArray = [];
    flagsArray = [];

    sellSize =  '' + (80 - ((HEIGHT - 10) * 4)) + 'px';
    fontSize =  '' + (20 - (HEIGHT - 10)) + 'px';

    while(document.body.firstChild) {
        document.body.firstChild.remove();
    }

    let block = document.createElement('div');
    block.setAttribute('id', 'mainBlock');
    block.className = "card container mt-3 mb-3";

    let internalBlock = document.createElement('div');
    internalBlock.setAttribute('id', 'internalBlock');
    internalBlock.classList.add('mx-auto','mt-3', 'mb-3');

    let table = document.createElement('table');
    table.setAttribute('id', 'sapperField');
    table.className = "table table-bordered mt-3 mb-3 sized-table";

    for (let y = 0; y < HEIGHT; y++) {
        let row = document.createElement('tr');
        for (let x = 0; x < WIDTH; x++) {
            let cell = document.createElement('td');
            cell.classList.add("cell", "align-middle", "closed-cell");
            cell.style.width = sellSize;
            cell.style.height = sellSize;
            cell.style.fontSize = fontSize;

            cell.setAttribute('id', 'row' + y + 'col' + x);
            cell.onclick = () => {
                startPoint = new Cell(x, y);
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
}

function renderField() {

    for (let y = 0; y < HEIGHT; y++) {
        for(let x = 0; x < WIDTH; x++) {
            let cell = new Cell(x, y);
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

    for(let y = 0; y < HEIGHT; y++) {
        for(let x = 0; x < WIDTH; x++) {

            let cell = document.getElementById('row' + y + 'col' + x);

            let currentPosition = y*WIDTH + x;

            if(valueArray[currentPosition].isEmpty()) {
                cell.onclick = (() => {
                    openCells(x, y);
                })
            } else if (valueArray[currentPosition].isBomb()) {
                cell.onclick = (() => {
                    clickOnBomb();
                })
            } else {
                cell.onclick = (() => {
                    showCell(x, y);
                });
            }
            cell.oncontextmenu = (() => {
                putFlag(x, y);
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
        if(coordinates - WIDTH === bombPosition) return true;

        if(startPoint.positionStatus.includes('W')) {
            if(coordinates - (WIDTH + 1) === bombPosition) return true;
        }

        if(startPoint.positionStatus.includes('E')) {
            if(coordinates - (WIDTH - 1) === bombPosition) return true;
        }
    }

    if(startPoint.positionStatus.includes('E')) {
        if(coordinates + 1 === bombPosition) return true;
    }

    if(startPoint.positionStatus.includes('S')) {
        if(coordinates + WIDTH === bombPosition) return true;

        if(startPoint.positionStatus.includes('W')) {
            if(coordinates + (WIDTH - 1) === bombPosition) return true;
        }

        if(startPoint.positionStatus.includes('E')) {
            if(coordinates + (WIDTH + 1) === bombPosition) return true;
        }
    }

    if(startPoint.positionStatus.includes('W')) {
        if(coordinates - 1 === bombPosition) return true;
    }

    return false;
}

function openCells(x, y) {

    let cell = valueArray[y*WIDTH + x];

    if(!cell.isCalled) {

        if(!cell.isBomb()) {
            showCell(x, y)
        }

        if(cell.isEmpty()) {

            if(cell.positionStatus.includes('N')) openCells(x, y-1);

            if(cell.positionStatus.includes('N') && cell.positionStatus.includes('E')) openCells(x+1, y-1);

            if(cell.positionStatus.includes('E')) openCells(x+1, y);

            if(cell.positionStatus.includes('E') && cell.positionStatus.includes('S')) openCells(x+1, y+1);

            if(cell.positionStatus.includes('S')) openCells(x, y+1);

            if(cell.positionStatus.includes('S') && cell.positionStatus.includes('W')) openCells(x-1, y+1);

            if(cell.positionStatus.includes('W')) openCells(x-1, y);

            if(cell.positionStatus.includes('W') && cell.positionStatus.includes('N')) openCells(x-1, y-1);

        }
    }
}

function showCell(x, y) {

    let cell = document.getElementById('row' + y + 'col' + x);
    cell.onclick = null;
    cell.oncontextmenu = null;

    let style = "cell" + valueArray[y*WIDTH + x].value;
    cell.classList.add(style);

    valueArray[y*WIDTH + x].isCalled = true;

    if(!valueArray[y*WIDTH + x].isEmpty() && !valueArray[y*WIDTH + x].isBomb()) {
        clearCell(cell);
        cell.classList.remove('flagged');
        let value = document.createElement('p');
        value.innerHTML = valueArray[y*WIDTH + x].value;
        value.classList.add("mb-0");
        cell.append(value);
    } else if (valueArray[y*WIDTH + x].isBomb()) {
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

function putFlag(x, y) {

    if(flagsArray.length < AVAILABLE_FLAGS ) {
        let cell = document.getElementById('row' + y + 'col' + x);
        cell.classList.add('flagged');

        setIconPic(cell, 'images/flag.png', 'flag');

        cell.oncontextmenu = (() => {
            removeFlag(x, y);
        })

        flagsArray.push(y*WIDTH + x);

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

function removeFlag(x, y) {
    let cell = document.getElementById('row' + y + 'col' + x);
    cell.classList.remove('flagged');

    clearCell(cell);
    cell.classList.remove('flagged');

    cell.oncontextmenu = (() => {
        putFlag(x, y);
    })
    let index = flagsArray.findIndex(element => element === (y * WIDTH + x));
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
        let x_coordinate = coordinates % WIDTH;
        let y_coordinate = Math.floor(coordinates/WIDTH);
        showCell(x_coordinate, y_coordinate);
    }

    cleanAllClickListener();

    setResultLogo('images/lostPic.png', 'You died', '-200px');
}

function openAllField() {

    for(let y = 0; y < HEIGHT; y++) {
        for(let x = 0; x < WIDTH; x++) {
            let cell = document.getElementById('row' + y + 'col' + x);
            cell.onclick = null;
            cell.oncontextmenu = null;

            if(!valueArray[y*WIDTH + x].isCalled) {
                showCell(x, y);
            }
        }
    }

}

function cleanAllClickListener() {

    for(let y = 0; y < HEIGHT; y++) {
        for(let x = 0; x < WIDTH; x++) {
            let cell = document.getElementById('row' + y + 'col' + x);
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
    createTable();
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

        if(this.yCoordinate !== 0) {
            this.positionStatus = this.positionStatus + 'N';
        }

        if(this.xCoordinate !== WIDTH - 1) {
            this.positionStatus = this.positionStatus + 'E';
        }

        if(this.yCoordinate !== HEIGHT - 1) {
            this.positionStatus = this.positionStatus + 'S';
        }

        if(this.xCoordinate !== 0) {
            this.positionStatus = this.positionStatus + 'W';
        }

    }

    solveValue(bombArray) {

        let counter = 0;
        let currentPosition = this.solveCurrentPosition();

        if(this.positionStatus.includes('N')) {
            if(bombArray.includes(currentPosition - WIDTH)) counter++;

            if(this.positionStatus.includes('W')) {
                if(bombArray.includes(currentPosition - (WIDTH + 1))) counter++;
            }

            if(this.positionStatus.includes('E')) {
                if(bombArray.includes(currentPosition - (WIDTH - 1))) counter++;
            }
        }

        if(this.positionStatus.includes('E')) {
            if(bombArray.includes(currentPosition + 1)) counter++;
        }

        if(this.positionStatus.includes('S')) {
            if(bombArray.includes(currentPosition + WIDTH)) counter++;

            if(this.positionStatus.includes('W')) {
                if(bombArray.includes(currentPosition + (WIDTH - 1))) counter++;
            }

            if(this.positionStatus.includes('E')) {
                if(bombArray.includes(currentPosition + (WIDTH + 1))) counter++;
            }
        }

        if(this.positionStatus.includes('W')) {
            if(bombArray.includes(currentPosition - 1)) counter++;
        }

        this.value = counter;

    }

    solveCurrentPosition() {
        return this.yCoordinate * WIDTH + this.xCoordinate;
    }

    isBomb() {
        return this.value === 'B';
    }

    isEmpty() {
        return this.value === 0;
    }
}


//связка
//разнести на модули
