import { isObject } from 'chart.js/helpers';
import { generateReturnsArray } from './src/investmentsGoals';
import { Chart } from 'chart.js/auto';

const progressionChart = document.getElementById('progression');
const finalMoneyChart = document.getElementById('final-money-distribution');
const form = document.getElementById('investiment-form');
const clearFormBtn = document.getElementById('clear-form');

let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(vl) {
  return vl.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector('error')) {
    return;
  }

  resetCharts();

  const startingAmount = Number(
    document.getElementById('starting-amount').value.replace(',', '.')
  );
  const addittional = Number(
    document.getElementById('additional').value.replace(',', '.')
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.')
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.')
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    addittional,
    returnRate,
    returnRatePeriod
  );

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];
  console.log(finalInvestimentObject);

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total Investido', 'Rendimento', 'Imposto Retido'],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestimentObject.investedAmount),
            formatCurrency(
              finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestimentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investimentObject) => investimentObject.month),
      datasets: [
        {
          label: 'Investimento Total',
          data: returnsArray.map((investimentObject) =>
            formatCurrency(investimentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255,99,132)',
        },
        {
          label: 'Retorno do Investimento',
          data: returnsArray.map((investimentObject) =>
            formatCurrency(investimentObject.interestReturns)
          ),
          backgroundColor: 'rgb(54,162,235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  resetCharts();

  const errorInputContainers = document.querySelectorAll('.error');
  for (const errorContainer of errorInputContainers) {
    errorContainer.classList.remove('error');
    errorContainer.parentElement.querySelector('p').remove();
  }
}

function validadeInput(evt) {
  if (evt.target.value === '') {
    return;
  }
  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(',', '.');

  if (
    (isNaN(inputValue) || Number(inputValue) <= 0) &&
    !parentElement.classList.contains('error')
  ) {
    //Objetivo: <p class="text-red-500">Insira valor numerico e positivos</p>
    const errorTextElement = document.createElement('p'); //<p></p>
    errorTextElement.classList.add('text-red-500'); //<p classe:'text-red-500'></p>
    errorTextElement.innerText = 'Insira valor numérico e positivo'; //<p class="text-red-500">Insira valor numerico e positivos</p>

    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains('error') &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validadeInput);
  }
}

// form.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);
