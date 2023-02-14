const keyboard = document.getElementById('keyboard')
const buttonList = document.querySelectorAll('button')
const panelCalculation = document.getElementById('calculation-text')
const panelResult = document.getElementById('calculation-result')

var isFirstChangePanel = true
var operatorChosen = false;

let calculator = {
  numberA: 'none',
  numberB: 'none',
  operation: 'none',

  percent: percent,
  division: division,
  multiply: multiply,
  minus: minus,
  sum: sum
}

function keyPressed(event) {
  let targetPressed = event.target
  let targetIsButton = targetPressed.tagName == 'BUTTON' || targetPressed.tagName == 'I'
  
  if(targetIsButton) {
    showInPanel(targetPressed)
  }

  if(targetPressed.id == 'backspace') {
    backspace()
  }

  if(targetPressed.id == 'clear') {
    clear()
  }

  if(targetPressed.tagName == 'I' && targetPressed.id != 'plus-minus' && targetPressed.id != 'equal') {
    chooseOperator(targetPressed)
  }

  if(targetPressed.id == 'equal'){
    equal()
  }
}

function showInPanel(targetPressed) {
  if(targetPressed.id == 'plus-minus' && panelResult.innerHTML != '') {
    var floatNumber = handleDotsAndCommas(panelResult.innerHTML)
    floatNumber = floatNumber * (-1)
    panelResult.innerHTML = convertToBrasilNumberFormat(floatNumber)
    isFirstChangePanel = false
  }

  if(targetPressed.id == 'number'){
    if(isFirstChangePanel) {
      panelResult.innerHTML = targetPressed.innerHTML
      isFirstChangePanel = false
    } else {
      var panelNumber = panelResult.innerHTML
      panelNumber += targetPressed.innerHTML

      if(panelNumber.split(',').length <= 2){
        if(panelNumber.split(',').length > 1) {
          panelResult.innerHTML += targetPressed.innerHTML
        } else {
          panelNumber = handleDotsAndCommas(panelNumber)
          panelResult.innerHTML = convertToBrasilNumberFormat(panelNumber)
        }
      }
    }
  }
}

function convertToBrasilNumberFormat(floatNumber) {
  return floatNumber.toLocaleString('pt-BR', {maximumFractionDigits: 20})
}

function handleDotsAndCommas(textNumber) {
  return parseFloat(textNumber.replaceAll('.', '').replace(',', '.'))
}

function chooseOperator(targetOperator) {
  calculator.numberA = panelResult.innerHTML
  calculator.operation = targetOperator.id

  var iconOperator = document.createElement('i')
  iconOperator.setAttribute('class', targetOperator.className)
  iconOperator.setAttribute('id', targetOperator.id)
  iconOperator.setAttribute('style', 'font-size:1.5rem')

  panelCalculation.innerHTML = ''
  panelCalculation.innerHTML = panelResult.innerHTML
  panelCalculation.appendChild(iconOperator)
  operatorChosen = true
  isFirstChangePanel = true
}

function equal() {
  if(operatorChosen) {
    operatorChosen = false

    var numberA = handleDotsAndCommas(calculator.numberA)
    var numberB = handleDotsAndCommas(panelResult.innerHTML)
    var result = calculator[calculator.operation](numberA, numberB)
  
    
    panelCalculation.innerHTML += convertToBrasilNumberFormat(numberB)
    panelResult.innerHTML = convertToBrasilNumberFormat(result)
  }
}

function clear() {
  panelCalculation.innerHTML = '0'
  panelResult.innerHTML = '0'
}

function backspace() {
    var panelNumber = String(handleDotsAndCommas(panelResult.innerHTML))
    panelNumber = panelNumber.slice(0, panelNumber.length-1)
    var panelNumberConverted = convertToBrasilNumberFormat(parseFloat(panelNumber))
    isFloatNumber = panelNumberConverted != 'NaN'
    panelResult.innerHTML = isFloatNumber ? panelNumberConverted : '' 
}

function percent(numberA, numberB) {
  var result = numberA * numberB/100
  return result
}
function multiply(numberA, numberB) {
  var result = numberA * numberB
  return result
}
function minus(numberA, numberB) {
  var result = numberA - numberB
  return result
}
function sum(numberA, numberB) {
  var result = numberA + numberB
  return result
}
function division(numberA, numberB) {
  if(numberB == 0) {
    return 'Indefinido'
  }

  var result = numberA / numberB
  return result
}

function keyEvent(event) {
  var key = event.which;
  var keychar = String.fromCharCode(key);

  buttonList.forEach(button => {
    if(button.id == 'number' && !event.shiftKey) {
      if(button.innerHTML == ',' && key == '188') button.click()
      if(button.innerHTML == keychar) button.click()

    } else if(button.classList.contains('operator')) {
      if(event.shiftKey) {
        if(button.id == 'percent' && key == '53') button.firstChild.click()
        if(button.id == 'multiply' && key == '56') button.firstChild.click()
        if(button.id == 'sum' && key == '187') button.firstChild.click()

      } else if(button.id == 'equal' && key == '13') button.firstChild.click()
        else if(button.id == 'subtraction' && key == '189') button.firstChild.click()
        else if(button.id == 'division' && key == '193') button.firstChild.click()
    }
      else if(button.id == 'clear' && key == '46') button.click()
      else if(button.id == 'backspace' && key == '8') button.click()
      else if(button.id == 'plus-minus' && keychar == 'N') button.click()
  });
}

document.onkeyup = keyEvent

keyboard.addEventListener('click', keyPressed)