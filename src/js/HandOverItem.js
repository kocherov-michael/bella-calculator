export default class HandOverItem {
	constructor (args = {}) {
		this.args = args
		this.element = this.create(args)
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
			<span>${Math.round(args.price * 10) / 10}</span>&nbsp;
			<span>руб</span>
		</div>`

		parentElement.append(newElement)

		// прокручиваем до последнего добавленного элемента
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