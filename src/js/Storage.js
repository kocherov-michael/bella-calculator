export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = this.read() || []
		// console.log('прочитали ил памяти', dataArray)
		dataArray.push({name: data.inputValue})
		localStorage.setItem('bella-workers', JSON.stringify(dataArray))
		// console.log('сохранено', dataArray)
	}
	read (page) {
		const data = JSON.parse(localStorage.getItem('bella-workers'))
		// console.log('прочитал', data)
		return data || []
	}

	// загрузка недель по имени работника
	getWorkerWeeks(name) {
		const dataArray = this.read()
		// console.log(dataArray)
		for(let i = 0; i < dataArray.length; i++) {
			if (dataArray[i].name === name) {
				// console.log( dataArray[i].weeks || 'empty')
				return dataArray[i].weeks || 'empty'
			}
		}
	}
}
// localStorage.setItem('bellaPlus', JSON.stringify(data))
// JSON.parse(localStorage.getItem('bellaPlus'))