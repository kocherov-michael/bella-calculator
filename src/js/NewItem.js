import Handler from './Handler'

export default class Item {
	constructor (args = {}) {
		// this.handler = new Handler()
		// if (args.type === 'salary') {
		// 	this.newElement = Item.createSalaryItem(args)

		// 	const handler = new Handler({
		// 		itemHandler: this.newElement,
		// 		// deleteable: this.newElement
		// 	})


		// }
		// else if (args.type === 'handOverItem') {
		// 	this.newElement = Item.createHandOverItem(args)

		// 	const handler = new Handler({
		// 		deleteable: this.newElement
		// 	})

		// }
		// else if (args.type === 'weavingItem') {
		// 	this.newElement = Item.createWeavingItem(args)

		// 	const handler = new Handler({
		// 		deleteable: this.newElement
		// 	})
		// }
		// else if (args.type === 'removedItem') {
		// 	this.newElement = Item.createRemovedItem(args)

		// 	const handler = new Handler({
		// 		args,
		// 		itemHandler: this.newElement,
		// 		deleteable: this.newElement
		// 	})
		// }
		//  else {
		// 	this.create(args)
		// }
	}

	

	// create(args) {

	// 	const parentElement = args.field
	// 	let newElement = document.createElement('div')
	// 	newElement.classList.add('item')
	// 	newElement.setAttribute('data-worker', args.workerName)
	// 	newElement.setAttribute('data-id', args.id)
		
	// 	// если тип - работник
	// 	if (args.type === 'single') {
	// 		newElement.setAttribute('data-next', 'weeksList')
	// 		newElement.innerHTML = 
	// 		`<div class="item__header">
	// 			<div class="item__header-text" data-item-name>${args.text || 'у девочки нет имени'}</div>
	// 			<div class="item__header-arrow">
	// 				<div class="chevron"></div>
	// 			</div>
	// 		</div>`
	// 	}
	// 	// если тип - неделя
	// 	else if (args.type === 'week') {
	// 		// newElement.setAttribute('data-next', 'weekItems')
	// 		newElement.setAttribute('data-next', 'brigade')
	// 		newElement.setAttribute('data-week-number', args.text)
			
	// 		newElement.innerHTML =
	// 		`<div class="item__header">
	// 		<div class="item__header-text">Неделя <span>${args.text || 'не установлена'}</span></div>
	// 		<div class="item__header-arrow">
	// 			<div class="chevron"></div>
	// 		</div>
	// 	</div>`
	// 	}

	// 	// если простая операция
	// 	else if (args.type === 'weekItem') {
	// 		newElement = Item.createSingleOperation(newElement, args)
	// 	}
	// 	parentElement.appendChild(newElement)
		
	// 	const handler = new Handler({
	// 		itemHandler: newElement,
	// 		deleteable: newElement
	// 	})

	// 	// прокручиваем до последнего добавленного элемента
	// 	setTimeout(()=> {newElement.scrollIntoView()},400)
		
	// 	return newElement
	// }

	// static createSingleOperation (newElement, args) {
	// 	newElement.classList.add('week-item', 'closedable', 'closed', 'hidetext')
	// 	newElement.setAttribute('data-week-number', args.weekNumber)

	// 	// преобразуем вид веса + или -
	// 	let weightValue
	// 	let weightClass = ''
	// 	if (args.weight > 0) {
	// 		weightValue = `+ ${args.weight}`
	// 	}
	// 	else {
	// 		weightValue = `- ${Math.abs(args.weight)}`
	// 		weightClass = 'item__header-text_minus'
	// 	}

	// 	newElement.innerHTML =
	// 	`<div class="item__header">
	// 	<div class="item__header-text ${weightClass}">${weightValue}</div>
	// 	<div class="item__header-arrow">
	// 		<div class="chevron"></div>
	// 	</div>
	// </div>

	// <div class="item__lower">
	// 	<span>Промежуточный баланс:</span>
	// 	<span>5678</span>
	// 	<span>&nbsp;г</span>
	// </div>`

	// 	return newElement

	// }

	// // создаём блок сдачи на странице недели
	// static createSalaryItem(args) {
	// 	const parentElement = args.field
	// 	const newElement = document.createElement('div')
	// 	newElement.classList.add('item')
	// 	newElement.classList.add('salary-item')
	// 	newElement.setAttribute('data-worker', args.workerName)
	// 	newElement.setAttribute('data-next', 'handOverItems')
	// 	newElement.setAttribute('data-week-number', args.weekNumber)

	// 	newElement.innerHTML = 
	// 	`<div class="item__header">
	// 	<div class="item__header-text">Сдача</div>
	// 	<div class="item__header-arrow">
	// 		<div class="chevron"></div>
	// 	</div>
	// </div>

	// <div class="item__uppper">
	// 	<span>Зарплата:</span>
	// 	<span data-week-salary>0</span>
	// 	<span>&nbsp;₽</span>
	// </div>

	// <div class="item__lower">
	// 	<span>Вес:</span>
	// 	<span data-week-weight>0</span>
	// 	<span>&nbsp;г</span>
	// </div>`
		
	// 	parentElement.prepend(newElement)
		
	// 	return newElement

	// }

	// // создаём элемент операции сдачи
	// static createHandOverItem (args) {
	// 	const parentElement = args.field
	// 	const newElement = document.createElement('div')
	// 	newElement.classList.add('item')
	// 	newElement.classList.add('salary-item')
	// 	newElement.setAttribute('data-id', args.id)
	// 	newElement.setAttribute('data-worker', args.workerName)
	// 	newElement.setAttribute('data-week-number', args.weekNumber)

	// 	const chainArray = ["цепь", "цепи", "цепей"]
	// 	const braceletArray = ["браслет", "браслета", "браслетов"]

	// 	let chainText
	// 	if (args.isChain) {
	// 		chainText = Item.makeWordsEnds( args.count, chainArray)
	// 	} else {
	// 		chainText = Item.makeWordsEnds( args.count, braceletArray)
	// 	}

	// 	newElement.innerHTML =
	// 	`<div class="item__header">
	// 		<div class="item__header-text">
	// 				-
	// 				<span>${args.weight}</span> + 
	// 				<span>${args.percent}</span>% = 
	// 				<span>${args.weightWithPercent}</span>
	// 		</div>
			
	// 	</div>

	// 	<div class="item__uppper">
	// 		<span>${args.weaving}</span>
	// 		<span>${args.count}</span>&nbsp;
	// 		<span>${chainText}</span>
	// 	</div>

	// 	<div class="item__lower">
	// 		<span>Сумма:</span>
	// 		<span>${args.price}</span>&nbsp;
	// 		<span>₽</span>
	// 	</div>`

	// 	parentElement.append(newElement)

	// 	// прокручиваем до последнего добавленного элемента
	// 	setTimeout(()=> {
	// 		newElement.scrollIntoView()
	// 	},400)
	// 	return newElement
	// }

	// // создаём элемент плетения
	// static createWeavingItem (args) {
	// 	const parentElement = args.field
	// 	let newElement = document.createElement('div')
	// 	newElement.classList.add('item')
	// 	newElement.classList.add('weaving-item')
	// 	newElement.setAttribute('data-id', args.id)

	// 	newElement.innerHTML =
	// 	`<div class="item__header">
	// 	<div class="item__header-text">${args.weavingName}</div>
	// 	<div class="item__header-arrow">
	// 		<div class="weaving-item__percent"><span>${args.percent}</span>%</div>
	// 	</div>
	// </div>

	// <div class="item__uppper">
	// 	<span>Цепь:</span>
	// 	<span>${args.chain}</span>
	// 	<span>&nbsp;₽</span>
	// </div>

	// <div class="item__lower">
	// 	<span>Браслет:</span>
	// 	<span>${args.bracelet}</span>
	// 	<span>&nbsp;₽</span>
	// </div>`

	// 	parentElement.append(newElement)
	// 	setTimeout(()=> {
	// 		newElement.scrollIntoView()
	// 	},400)

	// 	return newElement
	// }

	// создаём удалённый элемент
	static createRemovedItem (args) {
		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.classList.add('weaving-item')
		newElement.setAttribute('data-id', args.id)

		newElement.innerHTML =
		`<div class="item__header">
		<div class="item__header-text">${args.removedItemName}</div>
		<div class="item__header-arrow">
			<div class="weaving-item__percent"></div>
		</div>
	</div>

	<div class="item__lower">
		<span>Удалено:</span>
		<span>${args.time}</span>
		
	</div>`

		parentElement.append(newElement)
		setTimeout(()=> {
			newElement.scrollIntoView()
		},400)

		return newElement
	}

	// правильно склоняем числительные
	static makeWordsEnds( number, array) {
    let string = ""
		const lastNum = String(number)[String(number).length-1]
    const previosNum = String(number)[String(number).length-2]

    if (lastNum === "1" && previosNum !== "1") {
      string = array[0]
    } else if ((lastNum === "2" || lastNum === "3" || lastNum === "4") && previosNum !== "1") {
      string = array[1]
    } else if (number === 0) {
      string = ""
    } else {
      string = array[2]
    }
    return string
	}
	
}