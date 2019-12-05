import Handler from './Handler'

export default class Item {
	constructor (args = {}) {
		// this.handler = new Handler()
		// if (args.start) {
			this.create(args)
		// }
	}

	create(args) {
		// let classNameView
		// let classNameType

		// if (args.type === 'add') {
		// 	classNameView = 'item_warning'
		// 	classNameType = 'item_add'
		// }

		// console.log(args)
		const parentElement = args.field
		const newElement = document.createElement('div')
		newElement.classList.add('item')
		// newElement.classList.add(className)
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
		</div>

		<div class="item__uppper">
			<span>Зарплата:</span>
			<span>${args.salary || 0}</span>
			<span>&nbsp;₽</span>
		</div>

		<div class="item__lower">
			<span>Остаток:</span>
			<span>${args.lost || 'неизвестно'}</span>
			<span>&nbsp;г</span>
		</div>`
		}
		parentElement.appendChild(newElement)

		const handler = new Handler({
			itemHandler: newElement
		})

		return newElement
	}
}