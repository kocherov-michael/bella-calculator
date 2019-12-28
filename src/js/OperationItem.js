export default class OperationItem {
	constructor (args = {}) {
		this.args = args
		this.element = this.create(args)
	}

	create (args) {

		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-id', args.id)

		newElement.classList.add('week-item', 'closedable', 'closed', 'hidetext')
		newElement.setAttribute('data-week-number', args.weekNumber)

		// преобразуем вид веса + или -
		let weightValue
		let weightClass = ''
		if (args.weight > 0) {
			weightValue = `+ ${args.weight}`
		}
		else {
			weightValue = `- ${Math.abs(args.weight)}`
			weightClass = 'item__header-text_minus'
		}

		newElement.innerHTML =
		`<div class="item__header">
		<div class="item__header-text ${weightClass}">${weightValue}</div>
	</div>`

		parentElement.appendChild(newElement)

		// прокручиваем до последнего добавленного элемента
		setTimeout(()=> {newElement.scrollIntoView()},400)
		
		return newElement
	}
}