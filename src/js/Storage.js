export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = this.read() || []
		console.log('прочитали ил памяти', dataArray)
		dataArray.push(data.inputValue)
		localStorage.setItem('bella-workers', JSON.stringify(dataArray))
		console.log('сохранено', dataArray)
	}
	read (page) {
		const data = JSON.parse(localStorage.getItem('bella-workers'))
		console.log('прочитал', data)
		return data || []
	}
}
// localStorage.setItem('bellaPlus', JSON.stringify(data))
// JSON.parse(localStorage.getItem('bellaPlus'))