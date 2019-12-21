import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class HandOverItem extends NewItem {
	constructor (args = {}) {
		super(args)
		// console.log(args)
		this.args = args
		this.element = this.create(args)
		this.itemHandler(this.element)
		// console.log('ok')
	}

	create (args) {

		const parentElement = args.field
		const newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.classList.add('salary-item')
		newElement.setAttribute('data-id', args.id)
		newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-week-number', args.weekNumber)

		const chainArray = ["цепь", "цепи", "цепей"]
		const braceletArray = ["браслет", "браслета", "браслетов"]

		let chainText
		if (args.isChain) {
			chainText = HandOverItem.makeWordsEnds( args.count, chainArray)
		} else {
			chainText = HandOverItem.makeWordsEnds( args.count, braceletArray)
		}

		newElement.innerHTML =
		`<div class="item__header">
			<div class="item__header-text">
					-
					<span>${args.weight}</span> + 
					<span>${args.percent}</span>% = 
					<span>${args.weightWithPercent}</span>
			</div>
			
		</div>

		<div class="item__uppper">
			<span>${args.weaving}</span>
			<span>${args.count}</span>&nbsp;
			<span>${chainText}</span>
		</div>

		<div class="item__lower">
			<span>Сумма:</span>
			<span>${args.price}</span>&nbsp;
			<span>₽</span>
		</div>`

		parentElement.append(newElement)

		// прокручиваем до последнего добавленного элемента
		setTimeout(()=> {
			newElement.scrollIntoView()
		},400)
		return newElement
	}

	itemHandler (element) {
		const {workerName, nextPageAttr, weekNumber} = this.args
		// console.log('itemHandler', this.args)
		element.addEventListener('click', () => {
			
			// let nextPageAttr = element.getAttribute('data-next')
			const currentPageAttr = 'brigade'

			// если кликаем на неделю, но не бригадир - идём в неделю работника "Я"
			// if (nextAttr === 'brigade' && !LocalStorage.isBrigadier()) {
			// 	nextAttr = 'weekItems'
			// }

		})
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