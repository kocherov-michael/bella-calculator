// import Handler from './Handler'
import PageHandler from './PageHandler'
import Router from './Router'
import LocalStorage from './LocalStorage'

// export default class DefaultPage {
export default class DefaultPage extends PageHandler {
	constructor (args = {}) {
		super(args)
	}

	createHeader (args) {
		// console.log('createHeader', args)
		args.workerName = args.name || ''
		const {page, isBrigadier, workerName = '', weekNumber = ''} = args
		// console.log(page)
		const headerElement = document.querySelector(`[data-header="${page}"]`)
		// const checked = Storage.isBrigadier() ? 'checked' : ''
		const checked = isBrigadier ? 'checked' : ''
		headerElement.innerHTML = ''
		headerElement.innerHTML = 
		`<div class="header__nav" data-header-nav="${page}">
		
		<div class="header__text" data-header-text="${page}"></div>
		<div class="header__menu" data-header-menu="${page}">
			<div class="menu-icon">
				<div class="menu-icon__line"></div>
			</div>
		</div>
		<div class="menu" data-menu-list>
			<button class="menu__item" data-next="quotation" data-quotation-link="${page}">Котировки</button>
			<button class="menu__item" data-next="weavingList"
			data-weaving-link="${page}">Плетения</button>
			<button class="menu__item" data-garbage-link="${page}">Восстановить удаления</button>
			<label class="menu__item check">
				<input class="check__input" type="checkbox" data-check-brigadier ${checked}>
				<div class="check__box">
					<div class="check__box-item"></div>
				</div>Я бригадир</label>
		</div>
	</div>`

		// обозначаем элементы меню навигации
		const sectionElement =  document.querySelector(`[data-page="${args.page}"]`)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')
		const weavingLinkElement = sectionElement.querySelector('[data-weaving-link]')
		const quotationLinkElement = sectionElement.querySelector('[data-quotation-link]')
		const garbageLinkElement = sectionElement.querySelector('[data-garbage-link]')
		const brigadierCheckBoxElement = sectionElement.querySelector('[data-check-brigadier]')

		// прослушка кнопки гамбургера
		headerMenuElement.addEventListener('click', () => {
			headerMenuElement.classList.toggle('cross')
			headerMenuListElement.classList.toggle('menu-show')
		} )

		// обработчик кнопки плетений
		weavingLinkElement.addEventListener('click', () => {
			Router.changeNextPage({
				currentPageAttr: args.page, 
				nextPageAttr: 'weavingList', 
				workerName, 
				weekNumber})

			setTimeout(() => {
				headerMenuElement.classList.toggle('cross')
				headerMenuListElement.classList.toggle('menu-show')
			}, 400)
			
		})

		// обработчик кнопки котировок
		quotationLinkElement.addEventListener('click', () => {
			
			// this.page.changeNextPage(args.page, 'quotation', args.workerName, args.weekNumber)
			Router.changeNextPage({
				currentPageAttr: args.page, 
				nextPageAttr: 'quotation', 
				workerName, 
				weekNumber})

			setTimeout(() => {
				headerMenuElement.classList.toggle('cross')
				headerMenuListElement.classList.toggle('menu-show')
			}, 400)
			
		})
		// обработчик кнопки корзины
		garbageLinkElement.addEventListener('click', () => {
			
			// this.page.changeNextPage(args.page, 'garbageList', args.name, args.weekNumber)

			Router.changeNextPage({
				currentPageAttr: args.page, 
				nextPageAttr: 'garbageList', 
				workerName, 
				weekNumber})

			setTimeout(() => {
				headerMenuElement.classList.toggle('cross')
				headerMenuListElement.classList.toggle('menu-show')
			}, 400)
			
		})

		// чекбокс бригадир
		brigadierCheckBoxElement.addEventListener('click', () => {
			// изменяем статус бригадир / не бригадир
			LocalStorage.setBrigadier(brigadierCheckBoxElement.checked)
		})

	}

	addCreateButton(args) {
		const { page, workerName = name, text, weekNumber } = args
		// console.log('addCreateButton', args)

		const fieldElement = document.querySelector(`[data-add-item="${page}"]`)

		// let text
		// if(page === ('start' || 'brigade')) {
		// 	text = 'Добавить сотрудника'
		// }
		// else if(page === 'weeksList') {
		// 	text = 'Добавить неделю'
		// }
		// else if(page === 'weavingList') {
		// 	text = 'Добавить плетение'
		// }

		fieldElement.innerHTML = ''
		// fieldElement.innerHTML = 
		// // <div class="item-field__items" data-item-field="${page}"></div>
		// `<div class="item item_warning item_add" data-add="${page}">
		// 	<div class="item__header">
		// 		<div class="item__header-text">${text}</div>
		// 		<div class="item__header-arrow">
		// 			<div class="chevron"></div>
		// 		</div>
		// 	</div>
		// </div>`

		// кнопка Добавить
		const addButtonElement = document.createElement('div')
		addButtonElement.classList.add('item', 'item_warning', 'item_add')
		addButtonElement.setAttribute('data-add', page)
		if ( workerName) {
			addButtonElement.setAttribute('data-current-worker', workerName)
		}
		addButtonElement.innerHTML = 
		`<div class="item__header">
			<div class="item__header-text">${text}</div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>`
		fieldElement.append(addButtonElement)


		super.addItemHandler({
			page,
			name,
			weekNumber,
			// addItem: page,
			workerName: name,
			addButtonElement
		})

		// const handler = new PageHandler({
		// 	page,
		// 	name,
		// 	weekNumber,
		// 	// menu: page,
		// 	addItem: page,
		// 	workerName: name,
		// 	// backButton: page
		// })
	}

	// добавляем в шапку стрелку назад
	createHeaderBackArrow (page, previousPage = '', weekNumber = '', workerName = '') {
		// console.log('createHeaderBackArrow', page)
		const headerNavElement = document.querySelector(`[data-header-nav="${page}"]`)
		// // если предыдущая страница не обозначена, значит она идёт по порядку
		// if(!previousPage) {
		// 	previousPage = this.getPreviousPage(page)
		// }

		// создаём элемент стрелки назад в шапке
		const arrowBackElement = document.createElement('div')
		
		arrowBackElement.classList.add('header__arrow')
		// arrowBackElement.setAttribute('data-header-back', previousPage)
		if (workerName !== '') {

			arrowBackElement.setAttribute('data-header-back-worker', workerName)
		}
		// если на странице со сдачей, то добавляем номер недели
		if (weekNumber !== '') {
			arrowBackElement.setAttribute('data-header-back-week', weekNumber)
		}
		headerNavElement.prepend(arrowBackElement)
  
		// создаём img стрелку назад
		const imgArrowElement = document.createElement('img')
		imgArrowElement.setAttribute('src', 'assets/img/arrow.svg')
		imgArrowElement.setAttribute('alt', 'назад')
		arrowBackElement.append(imgArrowElement)

		// обработчик кнопка назад
		arrowBackElement.addEventListener('click', () => {

			// console.log('back')
			Router.changePreviousPage(page, previousPage, weekNumber, workerName)
			// let targetPageAttr = backButtonElement.getAttribute('data-header-back')
			// const targetPageWeekAttr = backButtonElement.getAttribute('data-header-back-week')
			// let targetPageWorkerAttr = backButtonElement.getAttribute('data-header-back-worker')

			// if (targetPageAttr === 'start' && !Storage.isBrigadier()) {
			// 	targetPageAttr = 'weeksList'
			// 	targetPageWorkerAttr = 'Я'
			// }

			// this.page.changePreviousPage(page, targetPageAttr, targetPageWorkerAttr, targetPageWeekAttr)
			// // backButtonElement = null
		})

	}

	// показать текст в шапке
	showHeaderName (page, name, weekNumber = '') {
		// console.log(page, name, weekNumber)
		const headerTextElement = document.querySelector(`[data-header-text="${page}"]`)

		if (page === 'handOverItems') {
			headerTextElement.textContent = 'Сдача'
		}
		else if (page === 'weavingList') {
			headerTextElement.textContent = 'Плетения'
		}
		else if (page === 'quotation') {
			headerTextElement.textContent = 'Котировки'
		}
		else if (page === 'brigadeBalanceList') {
			headerTextElement.textContent = 'Приход в бригаду'
		}
		else if (page === 'weekItems') {
			headerTextElement.textContent = name
		}

		else if (headerTextElement) {
			// если есть номер недели, то неделя {номер}, иначе имя
			headerTextElement.textContent = weekNumber? `Неделя ${weekNumber}`: name
		}
	}

	// показать, что инпут пустой
	static showError (element, currentValue, falseValue) {
		
		if (currentValue == falseValue) {
			element.classList.add('warning-input')
			setTimeout(() => {
				element.classList.remove('warning-input')
			}, 2000)
			return true
		}
	}

	// создаём форму добавления простой операции в футере
	createFormAddSingleOperation (page, workerName, weekNumber) {
		const footerElement = document.querySelector(`[data-footer="${page}"]`)
		// если элемент уже есть, то удаляем его
		const footerOldActionElement = footerElement.querySelector('.footer__actions')
		if (footerOldActionElement)  {
			footerElement.removeChild(footerOldActionElement)
		}

		const footerActionElement = document.createElement('div')
		footerActionElement.classList.add('footer__actions')

		const formSingleOperationElement = document.createElement('div')
		formSingleOperationElement.classList.add('week-orepations')
		footerActionElement.append(formSingleOperationElement)

		// инпут для ввода веса
		const inputOperationElement = document.createElement('input')
		inputOperationElement.classList.add('week-orepations__input', 'input')
		inputOperationElement.setAttribute('placeholder', 'Введите вес')
		inputOperationElement.setAttribute('type', 'number')
		formSingleOperationElement.append(inputOperationElement)

		// кнопка Прибавить
		const addOperationElement = document.createElement('button')
		addOperationElement.classList.add('week-orepations__button', 'item', 'item_warning')
		addOperationElement.textContent = 'Прибавить'
		formSingleOperationElement.append(addOperationElement)

		// кнопка Вычесть
		const minusOperationElement = document.createElement('button')
		minusOperationElement.classList.add('week-orepations__button', 'item', 'item_subtract')
		minusOperationElement.textContent = 'Вычесть'
		formSingleOperationElement.append(minusOperationElement)

		footerElement.prepend(footerActionElement)

		// операция Добавить
		addOperationElement.addEventListener('click', () => {
			const operationValue = Math.abs(inputOperationElement.value.trim())
			this.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})

		// операция Вычесть
		minusOperationElement.addEventListener('click', () => {
			const operationValue = Math.abs(inputOperationElement.value.trim()) * -1
			this.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})
	}

	// обработка нажатий Прибавить и Вычесть в Операции
	addSingleOperationHandler (inputOperationElement, operationValue, workerName, weekNumber) {

		// Если ничего не введено, то предупреждаем пользователя
		// const ifEmpty = WeekItemsPage.showError(inputOperationElement, operationValue, '')
		const ifEmpty = DefaultPage.showError(inputOperationElement, operationValue, '')
		if (ifEmpty) return
		
		const newItemValues = {
			workerName,
			weekNumber,
			singleOperation: operationValue
		}

		// console.log('this.page', this.page)

		if (this.page === 'weekItems') {
			LocalStorage.saveOperation(newItemValues)
		}
		else if (this.page === 'brigadeBalanceList') {
			LocalStorage.saveBrigadeOperation(newItemValues)
		}
		
		// добавляем элемент на страницу

		// this.addFieldList('weekItems', workerName, weekNumber)

		this.addFieldList(this.page, workerName, weekNumber)

		// обновляем показания в футуре
		this.showFooterValues(this.page, workerName, weekNumber)
		// очищаем инпут после ввода цифры
		inputOperationElement.value = ''
	}

	// // показать, что инпут пустой
	// static showError (element, currentValue, falseValue) {
		
	// 	if (currentValue == falseValue) {
	// 		element.classList.add('warning-input')
	// 		setTimeout(() => {
	// 			element.classList.remove('warning-input')
	// 		}, 2000)
	// 		return true
	// 	}
	// }

	// показываем значения в подвале
	showFooterValues(page, workerName, weekNumber = '') {
		const footerElement = document.querySelector(`[data-footer="${page}"]`)

		// все работники
		if (page === 'start') {
			// let totalCommonWeight
			
			const footerAllWorkersElement = footerElement.querySelector('[data-all-workers-total]')
			footerAllWorkersElement.textContent = LocalStorage.getAbsolutelyTotalWeight()
		}

		// все недели
		const allWeeksWeight = LocalStorage.getWeightPreviousWeekItems(workerName)
		const footerAllWeeksWeightElement = footerElement.querySelector('[data-all-weeks-total]')
		if (footerAllWeeksWeightElement) footerAllWeeksWeightElement.textContent = allWeeksWeight

		// если загружаем список недель, то дальше не идём
		if (!weekNumber) return
		const {weekSalary, weight, weekTotalWeight} = Page.getWeekBalance(workerName, weekNumber)

		// сдача
		const footerSalaryElement = footerElement.querySelector('[data-week-salary]')
		const footerWeightElement = footerElement.querySelector('[data-week-weight]')
		if (footerSalaryElement) footerSalaryElement.textContent = weekSalary
		if (footerWeightElement) footerWeightElement.textContent = weight

		// 1 неделя
		const footerWeekWeightElement = footerElement.querySelector('[data-week-total]')
		if (footerWeekWeightElement) footerWeekWeightElement.textContent = weekTotalWeight

		

	}

	// получаем зарплату и сдачу за неделю
	getWeekBalance(workerName = this.workerName, weekNumber = this.weekNumber) {
		// console.log(workerName, weekNumber)
		const oneWeekObj = LocalStorage.getOneWorkerWeek(workerName, weekNumber)
		// console.log(oneWeekObj)
		// если недель нет совсем, то возвращаем всё по нулям
		if (!oneWeekObj) return {weekSalary: 0, weight: 0, weekTotalWeight: 0}

		const workerWeekHandOver = oneWeekObj.workerWeekHandOver
		const workerWeekWeight = oneWeekObj.workerWeekWeight
		
		// зарплата за неделю
		const weekSalary = workerWeekHandOver.reduce((accum,curr) => {
			return Math.round((accum + curr.weekSalary) * 10) / 10
		}, 0)

		// вес сдачи за неделю с процентами
		const weight = workerWeekHandOver.reduce((accum,curr) => {
			return Math.round((accum + curr.weightWithPercent) * 10000) / 10000
		}, 0)

		// вес с предыдущих недель
		const previousWeekWeight = LocalStorage.getWeightPreviousWeekItems(workerName, weekNumber)
		// Общий баланс к концу недели
		const weekTotalWeight = Math.round((previousWeekWeight + workerWeekWeight) * 10000) / 10000
		console.log()
		return {weekSalary, weight, weekTotalWeight}
	}


}