import DefaultPage from './DefaultPage'
// import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'
// import OperationItem from './OperationItem'
import HandOverItem from './HandOverItem'


export default class HandOverPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeekItemsPage(args)
	}

	// отрисовываем страницу сдачи
	renderWeekItemsPage(args) {
		// console.log('WeekItemsPage args:', args)
		args.page = 'handOverItems'
		const {page, workerName, weekNumber} = args
		args.isBrigadier = true
		super.createHeader(args)
		super.createHeaderBackArrow(page, 'weekItems', weekNumber, workerName)
		// this.showPreviousWeight(page, name, weekNumber)
		this.addFieldList(page, workerName, weekNumber)
		super.showHeaderName(page, workerName, weekNumber)
		this.createAddHandOverForm(page, workerName, weekNumber)
		// this.createSalaryItem(page, workerName, weekNumber)
		// this.showSalaryValues(args.page, args.workerName, args.weekNumber)
		// this.createFormAddSingleOperation(page, workerName, weekNumber)
		// this.showFooterValues(page, name, weekNumber)
	}

	addFieldList (page, workerName, weekNumber) {
		// const { page, workerName = 'Я', weekNumber } = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''

		const oneWeekObj = LocalStorage.getOneWorkerWeek(workerName, weekNumber)
		// console.log(oneWeekObj)
		oneWeekObj.workerWeekHandOver.forEach( (handOverItem) => {
			
			const handOverItemButton = new HandOverItem({
				// родительский элемент
				field: itemFieldElement,
				// type: 'handOverItem',
				workerName: name,
				weekNumber,
				// вес
				weight: handOverItem.weight,
				weightWithPercent: handOverItem.weightWithPercent,
				weaving: handOverItem.weaving,
				count: handOverItem.count,
				isChain: handOverItem.isChain,
				percent: handOverItem.percent,
				price: handOverItem.price,
				id: handOverItem.id
			})
		})

	}

	// создаём форму добавления сдачи
	createAddHandOverForm (page, workerName = name, weekNumber) {
		const footerActionElement = document.querySelector(`[data-footer-action="${page}"]`)

		let optionTemplate = ''
		const weavingArr = LocalStorage.getWeavingArray()
		for ( let i = 0; i < weavingArr.length; i++) {
			weavingArr[i].weavingName
			weavingArr[i].percent
			weavingArr[i].chain
			weavingArr[i].bracelet
			const stringTemplate = `<option class="option" value="${weavingArr[i].weavingName}">${weavingArr[i].weavingName}</option>`
			optionTemplate += stringTemplate
		}

		footerActionElement.innerHTML = ''

		const handOverFormElement = document.createElement('form')
		handOverFormElement.classList.add('hand-over-orepations')

		// инпут веса сдачи
		const weightInputElement = document.createElement('input')
		weightInputElement.setAttribute('type', 'number')
		weightInputElement.setAttribute('placeholder', 'Вес')
		weightInputElement.classList.add('hand-over-orepations__input', 'input')
		handOverFormElement.append(weightInputElement)

		// лейбл для селекта плетений
		const weavingSelectLabelElement = document.createElement('label')
		weavingSelectLabelElement.classList.add('hand-over-orepations__label')
		handOverFormElement.append(weavingSelectLabelElement)

		// селект плетений
		const weavingSelectElement = document.createElement('select')
		weavingSelectElement.setAttribute('type', 'select')
		weavingSelectElement.setAttribute('size', '0')
		weavingSelectElement.classList.add('hand-over-orepations__input', 'input')
		weavingSelectElement.innerHTML = 
		`<option class="option" value="choose" selected>Плетение</option>
		${optionTemplate}`
		weavingSelectLabelElement.append(weavingSelectElement)
		
		// инпут количества
		const countInputElement = document.createElement('input')
		countInputElement.setAttribute('type', 'number')
		countInputElement.setAttribute('placeholder', 'Количество')
		countInputElement.classList.add('hand-over-orepations__input', 'input')
		handOverFormElement.append(countInputElement)
		

		// лейбл для селекта цепь / браслет
		const lengthSelectLabelElement = document.createElement('label')
		lengthSelectLabelElement.classList.add('hand-over-orepations__label')
		handOverFormElement.append(lengthSelectLabelElement)
		
		// селект цепь / браслет
		const lengthSelectElement = document.createElement('select')
		lengthSelectElement.setAttribute('type', 'select')
		lengthSelectElement.setAttribute('size', '0')
		lengthSelectElement.classList.add('hand-over-orepations__input', 'input')
		lengthSelectElement.innerHTML = 
		`<option class="option" value="1">Цепь</option>
		<option class="option" value="0">Браслет</option>`
		lengthSelectLabelElement.append(lengthSelectElement)

		// кнопка добавления сдачи
		const handOverButtonElement = document.createElement('button')
		handOverButtonElement.classList.add('item', 'item_warning', 'item_add', 'hand-over-orepations__button')
		handOverButtonElement.innerHTML = 
		`<div class="item__header">
		<div class="item__header-text">Добавить к сдаче</div>
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>`
		handOverFormElement.append(handOverButtonElement)
		
		footerActionElement.append(handOverFormElement)

		// операция добавить к сдаче
		handOverButtonElement.addEventListener('click', (event) => {
			event.preventDefault()

			// если какое-то полу не заполнено, то предупреждаем пользователя
			const weightIsEmpty = DefaultPage.showError(weightInputElement, weightInputElement.value, '')
			const countIsEmpty = DefaultPage.showError(countInputElement, countInputElement.value, '')
			const weavingIsEmpty = DefaultPage.showError(weavingSelectElement, weavingSelectElement.value, 'choose')
			if (weightIsEmpty || countIsEmpty || weavingIsEmpty) return

			// получаем параметры плетения для вычисления сдачи
			const {weavingName, percent, chain, bracelet} = LocalStorage.getOneWeaving(weavingSelectElement.value)
			
			// количество
			const count = Math.floor(+countInputElement.value)
			// цепь - правда или браслет - ложь
			const isChain = Boolean(+lengthSelectElement.value)
			// цена на цепь либо браслет
			const price = (isChain ? chain : bracelet) * count

			// создаём объект для записи в память сдачи
			const handOverObj = {
				weight: Math.round(+weightInputElement.value * 10000) / 10000,
				weightWithPercent: HandOverPage.getWeightWithPercent(+weightInputElement.value, percent),
				weaving: weavingSelectElement.value,
				count,
				isChain,
				percent,
				price
			}

			const newHandOverValues = {
				workerName,
				weekNumber,
				handOverOperation: handOverObj
			}
			
			LocalStorage.saveHandOverOperation(newHandOverValues)
			console.log(this.page)
			this.addFieldList(page, workerName, weekNumber)
			// this.showFooterValues(page, workerName, weekNumber)

			// после ввода операции сбрасываем вес и количество
			weightInputElement.value = ''
			countInputElement.value = ''
		})

	}

	// получаем вес с процентами по весу
	static getWeightWithPercent (weight, percent) {
		return Math.round(weight * 10000 + weight * percent * 10000 / 100) / 10000
	}

}