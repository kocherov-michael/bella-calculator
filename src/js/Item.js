import Handler from './Handler'

export default class Item {
	constructor (args = {}) {
		// this.handler = new Handler()
		if (args.type === 'salary') {
			Item.createSalaryItem(args)
		} else {
			this.create(args)
		}
	}

	create(args) {

		// console.log(args)
		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.setAttribute('data-worker', args.workerName)
		
		// если тип - работник
		if (args.type === 'single') {
			newElement.setAttribute('data-next', 'weeksList')
			newElement.innerHTML = 
			`<div class="item__header">
				<div class="item__header-text" data-item-name>${args.text || 'у девочки нет имени'}</div>
				<div class="item__header-arrow">
					<div class="chevron"></div>
				</div>
			</div>`
		}
		// если тип - неделя
		else if (args.type === 'week') {
			newElement.setAttribute('data-next', 'weekItems')
			newElement.setAttribute('data-week-number', args.text)
			
			newElement.innerHTML =
			`<div class="item__header">
			<div class="item__header-text">Неделя <span>${args.text || 'не установлена'}</span></div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>`
		}

		// если простая операция
		else if (args.type === 'weekItem') {
			newElement = Item.createSingleOperation(newElement, args)
		}
		parentElement.appendChild(newElement)
		
		const handler = new Handler({
			itemHandler: newElement
		})
		// прокручиваем до последнего добавленного элемента
		setTimeout(()=> {newElement.scrollIntoView()},400)
		

		return newElement
	}

	static createSingleOperation (newElement, args) {
		newElement.classList.add('week-item', 'closedable', 'closed', 'hidetext')

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
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>

	<div class="item__lower">
		<span>Промежуточный баланс:</span>
		<span>5678</span>
		<span>&nbsp;г</span>
	</div>`

		return newElement

	}
	// static createElement(args) {
	// 	const parentElement = args.field
	// 	let newElement = document.createElement('div')
	// 	newElement.classList.add('item')
	// 	newElement.setAttribute('data-worker', args.workerName)

	// 	return
	// }

	static createSalaryItem(args) {
		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.classList.add('salary-item')
		newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-next', 'handOverItems')
		newElement.setAttribute('data-week-number', args.weekNumber)

		newElement.innerHTML = 
		`<div class="item__header">
		<div class="item__header-text">Сдача</div>
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>

	<div class="item__uppper">
		<span>Зарплата:</span>
		<span data-week-salary>0</span>
		<span>&nbsp;₽</span>
	</div>

	<div class="item__lower">
		<span>Вес:</span>
		<span data-week-weight>0</span>
		<span>&nbsp;г</span>
	</div>`
		
		parentElement.prepend(newElement)
		
		const handler = new Handler({
			itemHandler: newElement
		})

	}
}