import React from 'react';


const TestTable = props => {
	const { data } = props;

	// Define Variables
	const uniqueYears = [...new Set(data.map(item => item.Year))];
	const uniqueNames = [...new Set(data.map(item => item.Name))];
	let totals = [];

	// Get the total hits per company per year.
	for (let uyear of uniqueYears) {
		for (let uname of uniqueNames) {
			totals.push(getYearTotal(data, uname, uyear));
		}
	}

	// Define Month Strings
	const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// Form Data
	totals = [...getTotalPercentages(uniqueYears, totals, uniqueNames)];
	totals = [...getGrandTotals(totals, uniqueNames)];
	totals = [...getMonths(uniqueYears, uniqueNames, data, totals)];
	const tableData = formTableData(totals, uniqueYears);

	return (
		<div className='flex  flex-col items-center p-4 bg-white'>
			{tableData.map((table, ti) => (
				<table className='w-fit mt-4 shadow-lg border border-stone-300' key={ti}>
					<thead>
						<tr className=''>
							<td className='bg-[#333] text-white'>{''}</td>
							<td className='bg-[#333] text-white text-center p-4' colSpan={12}>
								{table.table}
							</td>
							<td rowSpan={2} className=' border-r border-b border-gray-500 bg-[#454545] text-white px-6 py-4'>
								<p className='border-b border-orange-500'>Total</p>
							</td>
							<td rowSpan={2} className=' border-r border-b border-gray-500 bg-[#454545] text-white px-6 py-4'>
								<p className='border-b border-orange-500'>
									Total <span className='text-orange-500'>%</span>
								</p>
							</td>
							<td rowSpan={2} className=' border-r border-b border-gray-500 bg-[#454545] text-white px-6 py-4'>
								<p className='border-b border-orange-500'>Grand Total</p>
							</td>
							<td rowSpan={2} className=' border-r border-b border-gray-500 bg-[#454545] text-white px-6 py-4'>
								<p className='border-b border-orange-500'>
									Grand Total <span className='text-orange-500'>%</span>
								</p>
							</td>
						</tr>
						<tr className=''>
							<td className='bg-[#0c4574]'>{''}</td>
							{monthStrings.map((monthString, msIndex) => (
								<td className='bg-[#0c4574] text-white p-4' key={msIndex}>
									{monthString}
								</td>
							))}
						</tr>
					</thead>
					<tbody>
						{table.rows.map((row, rIndex) => (
							<tr className=' text-center' key={rIndex}>
								<td className='px-4 bg-gray-200 border-r border-b border-gray-300'>{row.company}</td>
								{row.months.map((month, mIndex) => (
									<td className={`${month === 'X' ? 'text-red-600 text-lg font-semibold' : 'font-semibold'} bg-white border-r border-b border-gray-300 px-1 py-2`} key={mIndex}>
										{month}
									</td>
								))}
								<td className={`px-1 py-2 bg-[#454545] text-white text-right border-r border-b border-gray-500 pr-6`}>{row.total}</td>
								<td className=' px-1 py-2 bg-[#454545] text-white text-right border-r border-b border-gray-500 pr-6'>
									{row.percentage}
									<span className='text-orange-500'> %</span>
								</td>
								<td className={`px-1 py-2 bg-[#454545] ${ti > 0 ? 'text-center text-orange-500' : 'text-right pr-6 text-white'} border-r border-b border-gray-500 `}>
									{ti > 0 ? '*' : row.grandTotal}
								</td>
								<td className={`px-1 py-2 bg-[#454545] ${ti > 0 ? 'text-center text-orange-500' : 'text-right pr-6 text-white'}  border-r border-b border-gray-500 `}>
									{ti > 0 ? (
										'*'
									) : (
										<>
											{row.grandPercentage}
											<span className='text-orange-500'> %</span>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			))}
		</div>
	);
};

function formTableData(totals, years) {
	const tableData = [];
	for (let yIndex in years) {
		tableData.push({ table: years[yIndex], rows: [] });
		for (let total of totals) {
			if (total.year === years[yIndex]) tableData[yIndex].rows.push(total);
		}
	}

	console.log(`Table Data:`);
	console.log(JSON.stringify(tableData, null, 2));

	return tableData;
}
// Get month hits for each year -> company
function getMonths(uniqueYears, uniqueNames, data, totals) {
	// Get hits for each year, for each company per ordered month
	for (let year of uniqueYears) {
		for (let company of uniqueNames) {
			let monthValuesArray = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];

			for (let di = 0; di < data.length; di++) {
				if (data[di].Name === company && data[di].Year === year) {
					monthValuesArray[data[di].Month - 1] = data[di].Hits;
					// monthValuesArray.push(data[di].Hits);
				}
			}
			for (let ti = 0; ti < totals.length; ti++) {
				if (totals[ti].year === year && totals[ti].company === company) {
					totals[ti] = { ...totals[ti], months: monthValuesArray };
				}
			}
		}
	}
	return totals;
}

// Get the total hits for each year for each company
function getYearTotal(data, company, year) {
	const yearTotal = { year: year, company: company, total: 0 };
	for (let item of data) {
		if (item.Year === year && item.Name === company) yearTotal.total += item.Hits;
	}
	return yearTotal;
}

// Get the total percentages for each year for each company
function getTotalPercentages(years, totals) {
	// { year: 2020, sum: 10000 }
	let totalSums = [];
	let yearSum = 0;

	for (let year of years) {
		yearSum = 0;

		for (let total of totals) {
			if (total.year === year) yearSum += total.total;
		}

		totalSums.push({ year: year, sum: yearSum });
	}

	let totalPercentages = [];
	for (let total of totals) {
		let percentage = 0;
		for (let totalSum of totalSums) {
			if (total.year === totalSum.year) {
				percentage = (total.total / totalSum.sum) * 100;
				totalPercentages.push({ ...total, percentage: percentage.toFixed(2) });
			}
		}
	}

	return totalPercentages;
}

// Get the Grand Total and the Grand Total Percentage for all years for each company
function getGrandTotals(totals, companies) {
	let grandTotals = [];
	let grandTotalSum = 0;
	for (let company of companies) {
		const grandTotal = { company: company, grandTotal: 0 };
		for (let total of totals) {
			if (total.company === company) {
				grandTotal.grandTotal += total.total;
				grandTotalSum += grandTotal.grandTotal;
			}
		}
		grandTotals.push(grandTotal);
	}

	let grandTotalSum2 = 0;
	for (let gt of grandTotals) {
		grandTotalSum2 += gt.grandTotal;
	}

	for (let i = 0; i < totals.length; i++) {
		for (let y = 0; y < grandTotals.length; y++) {
			if (totals[i].company === grandTotals[y].company) {
				totals[i] = { ...totals[i], grandTotal: grandTotals[y].grandTotal, grandPercentage: ((grandTotals[y].grandTotal / grandTotalSum2) * 100).toFixed(2) };
			}
		}
	}

	return totals;
}

export default TestTable;
