import Handler from './Handler'
import Item from './Item'
import Storage from './Storage'

export default class Page {
	constructor (args = {}) {
		this.pages = [
			'start',
			'weeksList',
			'weekItems',
			'handOverItems'
		]

		if (args.start) {
			this.renderStartPage(args.start)
		}
	}
	



	renderStartPage (page, name = '', weekNumber = '') {
		// this.addHeader(page)
		this.createHeader(page)

		this.addCreateButton(page, name)
		this.addForm(page, name)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			addItem: page,
			// workerName: name,
			// backButton: page
		})
		
		this.addFieldList(page, name)
		// this.showHeaderName(page, name)

	}

	renderWeekListPage (page, name = '', weekNumber = '') {
		// this.addHeader(page)
		this.createHeader(page)
		this.createHeaderBackArrow(page)
		
		this.addCreateButton(page, name)
		this.addForm(page, name)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			addItem: page,
			workerName: name,
			backButton: page
		})
		
		this.addFieldList(page, name)
		this.showHeaderName(page, name)

	}

	renderWeekItemsPage (page, name = '', weekNumber = '') {
		// this.addHeader(page, name)
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name)
		// this.addCreateButton(page, name)
		// this.addForm(page, name)
		this.createFormAddSingleOperation(page, name, weekNumber)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			// addItem: page,
			workerName: name,
			backButton: page,
			addSingleOperation: weekNumber
		})
		
		this.addFieldList(page, name, weekNumber)
		this.showHeaderName(page, name, weekNumber)
		this.createSalaryItem(page, name, weekNumber)

	}

	// генерируем страницу сдачи
	renderHandOverItemsPage (page, name = '', weekNumber = '') {
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name, weekNumber)
		this.createAddHandOverForm(page, name, weekNumber)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			// addItem: page,
			workerName: name,
			backButton: page,
			addHandOverOperation: true
		})

		this.showHeaderName(page, name, weekNumber)
		this.addFieldList(page, name, weekNumber)

	}

	// генерируем страницу со списком плетений
	renderWeavingListPage(page, name = '', weekNumber = '', previousAttr = 'start') {
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name, weekNumber, previousAttr)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			// addItem: page,
			// workerName: name,
			backButton: page
		})
	}


	// создаём главный элемент сдачи
	createSalaryItem (page, name, weekNumber) {
		const salaryFieldElement = document.querySelector(`[data-salary-field="${page}"]`)

		// очищаем поле
		salaryFieldElement.innerHTML = ''

		const newElement = new Item({
			// родительский элемент
			field: salaryFieldElement,
			// вес
			text: 'Сдача',
			type: 'salary',
			workerName: name,
			weekNumber
		})

	}

	// создаём форму добавления сдачи
	createAddHandOverForm (page, name, weekNumber) {
		const footerActionElement = document.querySelector(`[data-footer-action="${page}"]`)

		footerActionElement.innerHTML = ''
		footerActionElement.innerHTML = 
		`<form class="hand-over-orepations" data-hand-over-operations="${name}">
		<input type="number" class="hand-over-orepations__input input" placeholder="Вес" data-input-weight="${weekNumber}">
		<label class="hand-over-orepations__label">
			<select type="select" class="hand-over-orepations__input input" size="0" data-select-weaving="${weekNumber}">
				<option class="option" value="choose" selected>Плетение</option>
				<option class="option" value="бсм20">бсм20</option>
				<option class="option" value="бсм30">бсм30</option>
				<option class="option" value="бсм40">бсм40</option>
				<option class="option" value="бсм50">бсм50</option>
				<option class="option" value="бсм60">бсм60</option>
				
			</select>
			<div class="chevron"></div>
		</label>

		<input type="number" class="hand-over-orepations__input input" placeholder="Количество" data-input-count="${weekNumber}">

		<label class="hand-over-orepations__label">
			<select type="select" class="hand-over-orepations__input input" data-select-length="${weekNumber}">
				<option class="option" value="1">Цепь</option>
				<option class="option" value="0">Браслет</option>
			</select>
			<div class="chevron"></div>
		</label>

		<button class="item item_warning item_add hand-over-orepations__button" data-hand-over-button="${weekNumber}">
			<div class="item__header">
				<div class="item__header-text">Добавить к сдаче</div>
				<div class="item__header-arrow">
					<div class="chevron"></div>
				</div>
			</div>
		</button>

	</form>`

	}

	// создаём форму добавления простой операции в футере
	createFormAddSingleOperation (page, name, weekNumber) {
		const footerElement = document.querySelector(`[data-footer="${page}"]`)
		// если элемент уже есть, то удаляем его
		const footerOldActionElement = footerElement.querySelector('.footer__actions')
		if (footerOldActionElement)  {
			footerElement.removeChild(footerOldActionElement)
		}

		const footerActionElement = document.createElement('div')
		footerActionElement.classList.add('footer__actions')

		footerActionElement.innerHTML = 
		`<div class="week-orepations" data-form-add-operation-worker-name="${name}">
			<input type="number" class="week-orepations__input input" placeholder="Введите вес" data-input-week-operation="${weekNumber}">
			
			<button class="week-orepations__button item item_warning" data-addbutton-operation="${weekNumber}">Прибавить</button>
			<button class="week-orepations__button item item_subtract" data-minusbutton-operation="${weekNumber}">Вычесть</button>

		</div>`
		
		footerElement.prepend(footerActionElement)
	}

	// Добавить форму
	addForm (page, name) {
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)
		// если на странице нет скрытых форм, то пропускаем
		if (!formContainerElement) return

		let attr
		let placeholder
		let text
		if(page === 'start') {
			attr = 'workerName'
			placeholder = 'Имя'
			text = 'Введите имя сотрудника'
		}
		else if(page === 'weeksList') {
			attr = 'weekNumber'
			placeholder = 'Номер недели'
			text = 'Введите номер недели'
		}

		formContainerElement.innerHTML = ''
		formContainerElement.innerHTML = 
		`<div class="form active-form opacity" data-active-form>
			<div class="form__heading">
				<div class="form__heading-text">${text}</div>
				<div class="form__heading-close" data-close-icon>&#10006;</div>
			</div>
			<div class="form__inputs">

					<input type="text" class="input" placeholder="${placeholder}" value="" name="${attr}">

			</div>
			<div class="form__buttons">
				<div class="form__buttons-save">
					<button class="item item_warning" data-save-button>
						<div class="item__header">
							<div class="item__header-text">Сохранить</div>
							<div class="item__header-arrow">
								<div class="symbol"></div>
							</div>
						</div>
					</button>
				</div>
				<div class="form__buttons-cancel">
					<button class="item item_cancel" data-cancel-button>
						<div class="item__header">
							<div class="item__header-text">Отменить</div>
							<div class="item__header-arrow">
								<div class="cross">&#10006;</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>`
		
	}

	// добавить кнопку добавления
	addCreateButton(page, name) {
		const fieldElement = document.querySelector(`[data-field="${page}"]`)

		let text
		if(page === 'start') {
			text = 'Добавить сотрудника'
		}
		else if(page === 'weeksList') {
			text = 'Добавить неделю'
		}

		fieldElement.innerHTML = ''
		fieldElement.innerHTML = 
		`<div class="item-field__items" data-item-field="${page}"></div>
		<div class="item item_warning item_add" data-add="${page}">
			<div class="item__header">
				<div class="item__header-text">${text}</div>
				<div class="item__header-arrow">
					<div class="chevron"></div>
				</div>
			</div>
		</div>`
	}

	// создаём шапку
	// импортируем
	createHeader (page) {
		const headerElement = document.querySelector(`[data-header="${page}"]`)
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
			<button class="menu__item">Котировки</button>
			<button class="menu__item" data-next="weavingList"
			data-weaving-link="${page}">Плетения</button>
			<button class="menu__item">Восстановить удаления</button>
		</div>
	</div>`

	}

	// добавляем в шапку стрелку назад
	// импортируем
	createHeaderBackArrow (page, name = '', weekNumber = '', previousPage = '') {
		// console.log('стрелку создаем', page)
		const headerNavElement = document.querySelector(`[data-header-nav="${page}"]`)
		// если предыдущая страница не обозначена, значит она идёт по порядку
		if(!previousPage) {
			previousPage = this.getPreviousPage(page)
		}
		// console.log(headerNavElement)

		// создаём элемент стрелки назад в шапке
		const arrowBackElement = document.createElement('div')
		// console.log(arrowBackElement)
		arrowBackElement.classList.add('header__arrow')
		arrowBackElement.setAttribute('data-header-back', previousPage)
		arrowBackElement.setAttribute('data-header-back-worker', name)
		// если на странице со сдачей, то добавляем номер недели
		if (weekNumber) {
			arrowBackElement.setAttribute('data-header-back-week', weekNumber)
		}
		headerNavElement.prepend(arrowBackElement)
  
		// создаём img стрелку назад
		const imgArrowElement = document.createElement('img')
		imgArrowElement.setAttribute('src', 'assets/img/arrow.svg')
		imgArrowElement.setAttribute('alt', 'назад')
		arrowBackElement.append(imgArrowElement)
		// console.log(imgArrowElement)

	}

	// добавить стрелку назад
	// старый метод
	// addHeader(page, name = ''){
	// 	const headerElement = document.querySelector(`[data-header="${page}"]`)
		
	// 	// получаем аттрибут предыдущей страницы
	// 	const previousPage = this.getPreviousPage(page)

	// 	headerElement.innerHTML = ''
	// 	headerElement.innerHTML = 
	// 	`<div class="header__nav">
	// 	<div class="header__arrow" data-header-back="${previousPage}" data-header-back-worker="${name}"></div>
	// 	<div class="header__text" data-header-text="${page}"></div>
	// 	<div class="header__menu" data-header-menu="${page}">
	// 		<div class="menu-icon">
	// 			<div class="menu-icon__line"></div>
	// 		</div>
	// 	</div>
	// 	<div class="menu" data-menu-list>
	// 		<button class="menu__item">Котировки</button>
	// 		<button class="menu__item">Плетения</button>
	// 		<button class="menu__item">Восстановить удаления</button>
	// 	</div>
	// </div>`

	// // если не стартовая страница, то добавляем стрелку
	// 	if (page !== 'start') {
	// 		const headerArrowElement = document.querySelector(`[data-header-back="${previousPage}"]`)
	// 		const imgArrowElement = document.createElement('img')
	// 		imgArrowElement.setAttribute('src', 'assets/img/arrow.svg')
	// 		imgArrowElement.setAttribute('alt', 'назад')
	// 		headerArrowElement.append(imgArrowElement)
	// 	}

	// }

	// показать текст в шапке
	showHeaderName (page, name, weekNumber = '') {
		const headerTextElement = document.querySelector(`[data-header-text="${page}"]`)

		if (page === 'handOverItems') {
			headerTextElement.textContent = 'Сдача'
		}
		else if (headerTextElement) {
			// если есть номер недели, то неделя {номер}, иначе имя
			headerTextElement.textContent = weekNumber? `Неделя ${weekNumber}`: name
		}
	}
	

	// Создаём список элементов из памяти
	addFieldList (page, name = '', weekNumber = '') {
		// console.log(page, name)
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const data = Storage.read()
	
		// если страница стартовая
		if (page === 'start') {

			data.forEach( (worker) => {
				
				const workerButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// имя работника
					text: worker.workerName,
					type: 'single',
					workerName: worker.workerName
				})
			})
		}
		// если страница с неделями
		else if ( page === 'weeksList') {
			const workerWeeks = Storage.getWorkerWeeks(name)
			workerWeeks.weeks.forEach( (week) => {
				
				const weekButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// номер недели
					text: week.weekNumber,
					type: 'week',
					workerName: name
				})
			})

		}

		else if ( page === 'weekItems') {
			// console.log(name, weekNumber)
			const oneWeekObj = Storage.getOneWeek(name, weekNumber)
			oneWeekObj.weekItems.forEach( (weekItem) => {
				
				const weekItemButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// вес
					weight: weekItem.value,
					type: 'weekItem',
					workerName: name,
					previous: weekItem.isPrevious
				})
			})

		}

		else if ( page === 'handOverItems') {
			const oneWeekObj = Storage.getOneWeek(name, weekNumber)
			// console.log(oneWeekObj)
			oneWeekObj.weekHandOver.forEach( (handOverItem) => {
				
				const handOverButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					type: 'handOverItem',
					workerName: name,
					// вес
					weight: handOverItem.weight,
					weightWithPercent: handOverItem.weightWithPercent,
					weaving: handOverItem.weaving,
					count: handOverItem.count,
					isChain: handOverItem.isChain,
					percent: handOverItem.percent,
					price: handOverItem.price
				})
			})
		}

	}

	// перелистываем страницу вперёд
	changeNextPage (workerObj, currentPage, nextPage, name, weekNumber) {
		// console.log(workerObj)
		// console.log(nextPage)
		// console.log(name)
		
		const containerElement = document.querySelector('[data-container]')

		nextPage.classList.remove('hide')
		containerElement.classList.add('nextPage')

		const nextAttr = nextPage.getAttribute('data-page')
		const previousAttr = currentPage.getAttribute('data-page')
		// this.addFieldList(nextAttr, name)

		if (nextAttr === 'weeksList') {
			this.renderWeekListPage(nextAttr, name)
		}
		else if (nextAttr === 'weekItems') {
			this.renderWeekItemsPage(nextAttr, name, weekNumber)
		}
		else if (nextAttr === 'handOverItems') {
			this.renderHandOverItemsPage(nextAttr, name, weekNumber)
		}
		else if (nextAttr === 'weavingList') {
			this.renderWeavingListPage(nextAttr, name, weekNumber, previousAttr)
		}
		
		setTimeout( () => {
			currentPage.classList.add('hide')
			containerElement.classList.remove('nextPage')
		}, 400)
		// console.log(this)
	}

	// перелистываем страницу назад
	changePreviousPage (workerObj, currentPage, previousPage, name, weekNumber = '') {
		
		const containerElement = document.querySelector('[data-container]')

		previousPage.classList.remove('hide')
		containerElement.classList.add('fromNextToPrevious')
		
		const previousAttr = previousPage.getAttribute('data-page')
		// отрисовываем предыдущую страницу
		// this.renderPage(previousAttr, name)
		this.addFieldList(previousAttr, name, weekNumber)
		
		
		setTimeout( () => {
			containerElement.classList.add('previousPage')
		}, 0)

		setTimeout( () => {
			currentPage.classList.add('hide')
			containerElement.classList.remove('previousPage')
			containerElement.classList.remove('fromNextToPrevious')
		}, 400)
		// console.log(this)
		// console.log(this.handler)
	}

	getPreviousPage (currentAttr) {
		// console.log(currentAttr)
		// console.log(Page.pages)
		// const pages = [
		// 	'start',
		// 	'weeksList'
		// ]
		return this.pages[this.pages.indexOf(currentAttr) - 1] || ''
	}

}