window.onload = () => {
	//--------------------------------------------------------------------------------
	// FAKE API
	const typeChartButton = document.getElementById('typeChart');
	typeChartButton.addEventListener('change', () => {
		let typeChart = document.getElementById('typeChart').value;
		let canvas2 = document.getElementById('myChartTwo').getContext('2d');
		const url2 = 'https://api.jsonbin.io/b/613feeee9548541c29b16a62/1';
		axios.get(url2).then((responseFromAPI) => {
			//console.log(responseFromAPI.data.data);
			if (typeChart == 'line' || typeChart == 'radar') {
				bgcolor = 'rgba(167, 235, 211, 0.5)';
				bdColor = 'rgba(38, 199, 131, 1)';
			} else {
				bgcolor = [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				];
				bdColor = [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				];
			}

			//console.log(typeChart);
			//Get key
			const labels = Object.keys(responseFromAPI.data.data);
			const prices = labels.map((key) => responseFromAPI.data.data[key]);
			// context.clearRect(0, 0, canvas2.width, canvas2.height);
			// context.clearRect(0, 0, 1200, 1200);

			//Chart.defaults.font.size = 16;
			let myChart = new Chart(canvas2, {
				type: typeChart,
				data: {
					labels,
					datasets: [
						{
							label: 'TOP10 Crypto',
							data: prices,
							backgroundColor: bgcolor,
							borderColor: bdColor,
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					//add this to read keys
					maintainAspectRatio: true,
					scales: {
						y: {
							beginAtZero: true
						}
					},
					plugins: {
						legend: {
							labels: {
								// This more specific font property overrides the global property
								font: {
									size: 60
								}
							}
						}
					}
				}
			});
		});
	});
};
// Graph for currencies
const clickToPdf = document.getElementById('downloadPdf');
//var clickToPdf = document.getElementById('downloadPdf');
let canvas = document.getElementById('myChartTwo');
clickToPdf.addEventListener('click', () => {
	canvas.toBlob(function(blob) {
		let pdf = new jsPDF('p', 'px', [ 400, 400 ]);
		pdf.addImage(canvas, 0, 0, 400, 400);
		pdf.save('chartTopCurrency.pdf');
	});
});
