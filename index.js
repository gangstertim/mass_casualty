const express = require('express')
const blockspring = require('blockspring')
const app = express()

const generateVictim = victim => {
	const onSuccessfulIntervention = `document.getElementById('pulse').innerHTML = ${victim.pulse_intervention}`
	const onFailedIntervention = `document.getElementById('pulse').innerHTML = ${victim.pulse_no_intervention}`

	let html = ''
	html += `<h1>${victim.name}</h1>`
        html += `<div><img src="https://placem.at/people?w=300&random=${victim.id}&txt=0" /></div>`
	html += `<h2>Pulse: <span id="pulse">${victim.starting_pulse}</span></h2>`
	html += `<h2>Symptoms: ${victim.symptoms}</h2>`
	html += `<button onclick="${onSuccessfulIntervention}">Intervene Correctly!</button>`
	html += `<button onclick="${onFailedIntervention}">Intervene Incorrectly!</button>`
	return html;
}

blockspring.runParsed('query-public-google-spreadsheet', 
	{ 
		"query": 'select *', 
		"url":   'https://docs.google.com/spreadsheets/d/1VXCpySvN2JXj-Xv376EJY7EtDnDQyf4PFneESPX1MQ0/edit#gid=0'
	},
	{ 
		api_key: "br_89234_611ca3d81f4b105e2db05792e2f54405a067ee35"
	}, 
	res => { 
		const data = res.params.data;
		data.forEach(victim => {
			app.get('/' + victim.id, (req, res) => res.send(generateVictim(victim)))
		});
	}
);


app.get('/', (req, res) => res.send('App is running. Navigate to localhost:3000/victim_id'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

