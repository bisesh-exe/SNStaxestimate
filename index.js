document.getElementById('calculate-button').addEventListener('click', function(event) {
    event.preventDefault();
    calculateTotals();
});

function calculateTotals() {
    // Selecting inputs for income, tax withheld, and expenses
    var incomeInputs = document.querySelectorAll('input[id^="salary-wages"], input[id^="allowances"], input[id^="employer-lumpsum"], input[id^="employer-termination"], input[id^="australian-government-allowances"], input[id^="australian-government-pensions"], input[id^="australian-annuities"], input[id^="australian-superannuation-lumpsum"], input[id^="attributed-psi"], input[id^="interest"], input[id^="other"], input[id^="abn"]');
    var taxWithheldInputs = document.querySelectorAll('input[id$="tax-withheld"]');
    var expenseInputs = document.querySelectorAll('input[id^="expense-"]');
    
    var totalIncome = 0;
    var totalTaxWithheld = 0;
    var totalExpenses = 0;

    // Calculate total income (without tax withheld)
    incomeInputs.forEach(function(input) {
        var value = parseFloat(input.value);
        if (!isNaN(value)) {
            totalIncome += value;
        }
    });

    // Calculate total tax withheld (as a separate value, not added to income)
    taxWithheldInputs.forEach(function(input) {
        var value = parseFloat(input.value);
        if (!isNaN(value)) {
            totalTaxWithheld += value;
        }
    });

    // Calculate total expenses
    expenseInputs.forEach(function(input) {
        var value = parseFloat(input.value);
        if (!isNaN(value)) {
            totalExpenses += value;
        }
    });

    // Calculate net income (income minus expenses)
    var netIncome = totalIncome - totalExpenses - totalTaxWithheld;

    // Calculate tax based on the net income
    var tax = 0;
    if (netIncome <= 18200) {
        tax = 0;
    } else if (netIncome <= 45000) {
        tax = (netIncome - 18200) * 0.19;
    } else if (netIncome <= 120000) {
        tax = 5092 + (netIncome - 45000) * 0.325;
    } else if (netIncome <= 180000) {
        tax = 29467 + (netIncome - 120000) * 0.37;
    } else if (netIncome > 180000) {
        tax = 51667 + (netIncome - 180000) * 0.45;
    }

    // Calculate total income minus total tax withheld
    var incomeAfterTaxWithheld = totalIncome - totalTaxWithheld;

    // Calculate the medical levy
    var medicareLevyDropdown = document.getElementById('medicare-levy').value;
    var medicalLevy = 0;

    if (medicareLevyDropdown === 'yes' && netIncome > 26000) {
        medicalLevy = netIncome * 0.02;
    }

    var isMedicalLevyApplicable = (medicareLevyDropdown === 'yes' && netIncome > 26000) ? true : false;

    // Calculate low-income rebate
    var lowIncomeRebate = 0;

    if (netIncome < 37500) {
        lowIncomeRebate = 700;
    } else if (netIncome < 45000) {
        lowIncomeRebate = 700 - (netIncome - 37500) * 0.05;
    } else if (netIncome < 66667) {
        lowIncomeRebate = 325 - (netIncome - 45000) * 0.015;
    } else if (netIncome >= 66668) {
        lowIncomeRebate = 0;
    }

    // Ensure rebate is not negative
    lowIncomeRebate = Math.max(lowIncomeRebate, 0);

    // Calculate tax payable or refundable based on provided logic
    var E42 = tax;
    var F43 = lowIncomeRebate;
    var F44 = 0;
    var F28 = totalTaxWithheld;
    var F46 = medicalLevy;

    var taxPayableOrRefundable = 0;

    if (E42 < (F43 + F44)) {
        taxPayableOrRefundable = F28;
    } else if (F28 > (E42 + F46) - (F43 + F44)) {
        taxPayableOrRefundable = F28 - ((E42 + F46) - (F43 + F44));
    } else {
        taxPayableOrRefundable = 0;
    }

    var isTaxRefundable = taxPayableOrRefundable < 0;
    var taxRefundable = isTaxRefundable ? Math.abs(taxPayableOrRefundable) : 0;
    var taxPayable = isTaxRefundable ? 0 : taxPayableOrRefundable;

    // Existing JavaScript code

// Display results
document.getElementById('total-tax-withheld').innerHTML = 'Total Tax Withheld: $' + totalTaxWithheld.toFixed(2);
document.getElementById('total-expenses').innerHTML = 'Total Expenses: $' + totalExpenses.toFixed(2);
document.getElementById('net-income').innerHTML = 'Net Taxable Income: $' + netIncome.toFixed(2);
document.getElementById('tax').innerHTML = 'Tax: $' + tax.toFixed(2);
document.getElementById('income-after-tax').innerHTML = 'Total Income After Tax Withheld: $' + incomeAfterTaxWithheld.toFixed(2);
document.getElementById('low-income-rebate').innerHTML = 'Low Income Rebate: $' + lowIncomeRebate.toFixed(2);
document.getElementById('medical-levy').innerHTML = 'Medical Levy: $' + medicalLevy.toFixed(2);
document.getElementById('tax-status').innerHTML = 'Medical Levy Applicable: ' + (isMedicalLevyApplicable ? 'True' : 'False');
document.getElementById('tax-payable').innerHTML = 'Tax Refundable: $' + taxPayable.toFixed(2);
document.getElementById('tax-refundable').innerHTML = 'Tax Payable: $' + taxRefundable.toFixed(2);

// Hide or show tax payable and refundable based on amounts
document.getElementById('tax-payable').style.display = taxPayable > 0 ? 'block' : 'none';
document.getElementById('tax-refundable').style.display = taxRefundable > 0 ? 'block' : 'none';

}

document.getElementById('calculate-button').addEventListener('click', function(event) {
    event.preventDefault();
    calculateTotals();
    document.getElementById('download-pdf').style.display = 'block'; // Show the PDF download button
});

document.getElementById('download-pdf').addEventListener('click', function() {
    var element = document.body; // Change this to a specific section if needed
    
    var options = {
        margin: [0.5, 0.5, 0.5, 0.5], // Set all margins to 0
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true }, // Increased scale for better quality
        jsPDF: { 
            unit: 'in', 
            format: 'a4', // Adjust as needed
            orientation: 'portrait',
            autoPaging: true // Ensure proper pagination
        }
    };

    html2pdf().from(element).set(options).save();
});



