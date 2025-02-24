function convertToMonthlyreturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

function generateReturnsArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = 'monthly',
  monthlyContribution = 0,
  returnRate = 0,
  returnTimeFrame = 'monthly'
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      'O investimento inicial e prazo devem ser preenchidos com valores numericos.'
    );
  }
  const finalRturnRate =
    returnTimeFrame === 'monthly'
      ? 1 + returnRate / 100
      : convertToMonthlyreturnRate(1 + returnRate / 100);

  const finalTimeHotizon =
    timePeriod === 'monthly' ? timePeriod : timePeriod * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };
  const returnsArray = [referenceInvestmentObject];
  for (
    let timeReference = 1;
    timeReference <= finalTimeHotizon;
    timeReference++
  ) {
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * finalRturnRate;
    const totalAmount = interestReturns + monthlyContribution;
    const investedAmount = startingAmount + monthlyContribution * timeReference;
    const totalInterestReturns = totalAmount - investedAmount;

    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }
  return returnsArray;
}
