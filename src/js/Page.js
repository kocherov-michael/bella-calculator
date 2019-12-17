import Handler from './Handler'
import Item from './Item'
import Storage from './Storage'

export default class Page {
	constructor (args = {}) {

		if (args.start) {
				
				this.renderStartPage(args.start)
		}
	}
	



	renderStartPage (page, name = '', weekNumber = '') {
		// если бригадир
		if (Storage.isBrigadier()) {

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
			this.showFooterValues(page, name)
		}
		// если не бригадир, то сразу вторую страницу
		else {
			this.changeNextPage ('start', 'weeksList', 'Я')
		}

	}

	renderWeekListPage (page, name = '', weekNumber = '') {

		this.createHeader(page)
		// если бригадир, то стрелка назад и имя работника видны
		if (Storage.isBrigadier()) {
			this.createHeaderBackArrow(page)
			this.showHeaderName(page, name)
		}
		
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
		this.showFooterValues(page, name)
	}

	// страница недели
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
		
		this.showPreviousWeight(page, name, weekNumber)
		this.addFieldList(page, name, weekNumber)
		this.showHeaderName(page, name, weekNumber)
		this.createSalaryItem(page, name, weekNumber)
		this.showSalaryValues(page, name, weekNumber)
		this.showFooterValues(page, name, weekNumber)

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
		this.showFooterValues(page, name, weekNumber)

	}

	// генерируем страницу со списком плетений
	renderWeavingListPage(page, name = '', weekNumber = '', previousAttr = 'start') {
		// если переходим на страницу с плетениями со страницы с котировками,
		// то стрелка назад возвращает на стартовую страницу
		if (previousAttr === 'quotation' || previousAttr === 'garbageList') {
			previousAttr = 'start'
		}
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name, weekNumber, previousAttr)
		this.addCreateButton(page, name)
		this.addForm(page)


		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			addItem: page,
			backButton: page
		})

		this.showHeaderName(page, name, weekNumber)
		this.addFieldList(page, name, weekNumber)
	}

	// генерируем страницу котировок
	renderQuotationPage(page, name = '', weekNumber = '', previousAttr = 'start') {
		// если переходим на страницу с котировками со страницы с плетениями,
		// то стрелка назад возвращает на стартовую страницу
		if (previousAttr === 'weavingList' || previousAttr === 'garbageList') {
			previousAttr = 'start'
		}
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name, weekNumber, previousAttr)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			backButton: page
		})

		this.showHeaderName(page, name, weekNumber)
		Page.getCurrency(Page.dataHandler)
	}

	// генерируем страницу корзины
	renderGarbageListPage(page, name = '', weekNumber = '', previousAttr = 'start') {
		// если переходим на страницу корзины со страницы с котировками,
		// то стрелка назад возвращает на стартовую страницу
		if (previousAttr === 'quotation' || previousAttr === 'weavingList') {
			previousAttr = 'start'
		}
		this.createHeader(page, name)
		this.createHeaderBackArrow(page, name, weekNumber, previousAttr)
		this.addForm(page, name)

		const handler = new Handler({
			page,
			name,
			weekNumber,
			menu: page,
			// вешаем этот обработчик чтобы показывать форму восстановления элемента
			// addItem: page,
			backButton: page
		})

		this.showHeaderName('garbageList', 'Корзина')
		this.addFieldList(page, name, weekNumber)
	}




	// показываем вес с предыдущей недели
	showPreviousWeight(page, name, weekNumber) {
		const fieldElement = document.querySelector(`[data-field="${page}"]`)
		const previousWeekWeightElement = fieldElement.querySelector(`[data-previous-weight]`)
		const weight = Storage.getWeightPreviousWeekItems(name, weekNumber)
		
		// отображаем остаток с предыдущей недели: если 0, то без знака, иначе со знаком
		previousWeekWeightElement.textContent = weight == 0 ? '0' : (weight > 0 ? `+ ${weight}`: `- ${Math.abs(weight)}`)
	}

	// показываем значения в подвале
	showFooterValues(page, name, weekNumber = '') {
		const footerElement = document.querySelector(`[data-footer="${page}"]`)

		// все работники
		if (page === 'start') {
			// let totalCommonWeight
			
			const footerAllWorkersElement = footerElement.querySelector('[data-all-workers-total]')
			footerAllWorkersElement.textContent = Storage.getAbsolutelyTotalWeight()
		}

		// все недели
		const allWeeksWeight = Storage.getWeightPreviousWeekItems(name)
		const footerAllWeeksWeightElement = footerElement.querySelector('[data-all-weeks-total]')
		if (footerAllWeeksWeightElement) footerAllWeeksWeightElement.textContent = allWeeksWeight

		// если загружаем список недель, то дальше не идём
		if (!weekNumber) return
		const {price, weight, weekTotalWeight} = Page.getWeekBalance(name, weekNumber)

		// сдача
		const footerSalaryElement = footerElement.querySelector('[data-week-salary]')
		const footerWeightElement = footerElement.querySelector('[data-week-weight]')
		if (footerSalaryElement) footerSalaryElement.textContent = price
		if (footerWeightElement) footerWeightElement.textContent = weight

		// 1 неделя
		const footerWeekWeightElement = footerElement.querySelector('[data-week-total]')
		if (footerWeekWeightElement) footerWeekWeightElement.textContent = weekTotalWeight

		

	}


	// создаём главный элемент сдачи
	createSalaryItem (page, name, weekNumber) {
		const salaryFieldElement = document.querySelector(`[data-salary-field="${page}"]`)

		// очищаем поле
		salaryFieldElement.innerHTML = ''

		const {newElement} = new Item({
			// родительский элемент
			field: salaryFieldElement,
			// вес
			text: 'Сдача',
			type: 'salary',
			workerName: name,
			weekNumber
		})

		
	}
	
	// показываем значения в элементе сдачи на странице недели
	showSalaryValues(page, name, weekNumber) {
		const salaryFieldElement = document.querySelector(`[data-salary-field="${page}"]`)
		
		// показываем зарплату и сдачу за неделю
		const weekSalaryElement = salaryFieldElement.querySelector('[data-week-salary]')
		const weekWeightElement = salaryFieldElement.querySelector('[data-week-weight]')
		
		const {price, weight} = Page.getWeekBalance(name, weekNumber)
		weekSalaryElement.textContent = price
		weekWeightElement.textContent = weight
	}

	// получаем зарплату и сдачу за неделю
	static getWeekBalance(name, weekNumber) {
		const oneWeekObj = Storage.getOneWeek(name, weekNumber)
		// если недель нет совсем, то возвращаем всё по нулям
		if (!oneWeekObj) return {price: 0, weight: 0, weekTotalWeight: 0}

		const weekHandOver = oneWeekObj.weekHandOver
		const weekWeight = oneWeekObj.weekWeight
		
		const price = weekHandOver.reduce((accum,curr) => {
			return Math.round((accum + curr.price) * 10) / 10
		}, 0)
		const weight = weekHandOver.reduce((accum,curr) => {
			return Math.round((accum + curr.weightWithPercent) * 10000) / 10000
		}, 0)

		// вес с предыдущих недель
		const previousWeekWeight = Storage.getWeightPreviousWeekItems(name, weekNumber)
		// Общий баланс к концу недели
		const weekTotalWeight = Math.round((previousWeekWeight + weekWeight) * 10000) / 10000
		
		return {price, weight, weekTotalWeight}
	}









	// создаём форму добавления сдачи
	createAddHandOverForm (page, name, weekNumber) {
		const footerActionElement = document.querySelector(`[data-footer-action="${page}"]`)

		let optionTemplate = ''
		const weavingArr = Storage.getWeavingArray()
		for ( let i = 0; i < weavingArr.length; i++) {
			weavingArr[i].weavingName
			weavingArr[i].percent
			weavingArr[i].chain
			weavingArr[i].bracelet
			const stringTemplate = `<option class="option" value="${weavingArr[i].weavingName}">${weavingArr[i].weavingName}</option>`
			optionTemplate += stringTemplate
		}

		footerActionElement.innerHTML = ''
		footerActionElement.innerHTML = 
		`<form class="hand-over-orepations" data-hand-over-operations="${name}">
		<input type="number" class="hand-over-orepations__input input" placeholder="Вес" data-input-weight="${weekNumber}">
		<label class="hand-over-orepations__label">
			<select type="select" class="hand-over-orepations__input input" size="0" data-select-weaving="${weekNumber}">
				<option class="option" value="choose" selected>Плетение</option>
				${optionTemplate}
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
	addForm (page, name = '') {
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)
		// если на странице нет скрытых форм, то пропускаем
		if (!formContainerElement) return

		let attr
		let placeholder
		let text
		let saveButtonText = 'Сохранить'
		let inputFormsTemplate = ''
		

		if(page === 'start') {
			attr = 'workerName'
			placeholder = 'Имя'
			text = 'Введите имя сотрудника'
			inputFormsTemplate = 
		`<div class="form__inputs">
		<input type="text" class="input" placeholder="${placeholder}" value="" name="${attr}">
		</div>`
		}
		else if(page === 'weeksList') {
			attr = 'weekNumber'
			placeholder = 'Номер недели'
			text = 'Введите номер недели'
			inputFormsTemplate = 
		`<div class="form__inputs">
		<input type="text" class="input" placeholder="${placeholder}" value="" name="${attr}">
		</div>`
		}
		else if (page === 'weavingList') {
			attr = 'weavingName'
			placeholder = 'Название'
			text = 'Введите плетение'
			
			inputFormsTemplate = 
		`<div class="form__inputs">
		<input type="text" class="input" placeholder="${placeholder}" value="" name="${attr}">
		<input type="number" class="input" placeholder="Угар %" name="percent">
		<input type="number" class="input" placeholder="Цепь ₽" name="chain">
		<input type="number" class="input" placeholder="Браслет ₽" name="bracelet">
		</div>`
		}
		else if (page === 'garbageList') {
			attr = 'garbageList'
			text = 'Восстановить элемент?'
			saveButtonText = 'Восстановить'
		}

		formContainerElement.innerHTML = ''
		formContainerElement.innerHTML = 
		`<div class="form active-form opacity" data-active-form>
			<div class="form__heading">
				<div class="form__heading-text">${text}</div>
				<div class="form__heading-close" data-close-icon>&#10006;</div>
			</div>
			${inputFormsTemplate}
			<div class="form__buttons">
				<div class="form__buttons-save">
					<button class="item item_warning" data-save-button>
						<div class="item__header">
							<div class="item__header-text">${saveButtonText}</div>
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
		else if(page === 'weavingList') {
			text = 'Добавить плетение'
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
		const checked = Storage.isBrigadier() ? 'checked' : ''
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

	}

	// добавляем в шапку стрелку назад
	// импортируем
	createHeaderBackArrow (page, name = '', weekNumber = '', previousPage = '') {

		const headerNavElement = document.querySelector(`[data-header-nav="${page}"]`)
		// если предыдущая страница не обозначена, значит она идёт по порядку
		if(!previousPage) {
			previousPage = this.getPreviousPage(page)
		}

		// создаём элемент стрелки назад в шапке
		const arrowBackElement = document.createElement('div')
		
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

	}

	// показать текст в шапке
	showHeaderName (page, name, weekNumber = '') {
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
		else if (headerTextElement) {
			// если есть номер недели, то неделя {номер}, иначе имя
			headerTextElement.textContent = weekNumber? `Неделя ${weekNumber}`: name
		}
	}
	
	// Создаём список элементов из памяти
	addFieldList (page, name = '', weekNumber = '') {
		
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const data = Storage.read().workers || []
	
		// если страница стартовая
		if (page === 'start') {

			data.forEach( (worker) => {
				
				const workerButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// имя работника
					text: worker.workerName,
					type: 'single',
					workerName: worker.workerName,
					id: worker.id
				})
			})
		}
		// если страница с неделями
		else if ( page === 'weeksList') {
			// console.log(name)
			const workerWeeks = Storage.getWorkerWeeks(name)
			workerWeeks.weeks.forEach( (week) => {
				
				const weekButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// номер недели
					text: week.weekNumber,
					type: 'week',
					workerName: name,
					id: week.id
				})
			})

		}

		// операции в неделе
		else if ( page === 'weekItems') {
			
			const oneWeekObj = Storage.getOneWeek(name, weekNumber)
			oneWeekObj.weekItems.forEach( (weekItem) => {
				
				const weekItemButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// вес
					weight: weekItem.value,
					type: 'weekItem',
					workerName: name,
					weekNumber,
					previous: weekItem.isPrevious,
					id: weekItem.id
				})
			})

		}

		// операция сдачи
		else if ( page === 'handOverItems') {
			const oneWeekObj = Storage.getOneWeek(name, weekNumber)
			oneWeekObj.weekHandOver.forEach( (handOverItem) => {
				
				const handOverButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					type: 'handOverItem',
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

		// плетения
		else if ( page === 'weavingList') {
			const weavingArr = Storage.getWeavingArray()

			weavingArr.forEach( (weavingItem) => {
				
				const handOverButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					type: 'weavingItem',
					weavingName: weavingItem.weavingName,
					percent: weavingItem.percent,
					chain: weavingItem.chain,
					bracelet: weavingItem.bracelet,
					id: weavingItem.id
				})
			})
		}

		// корзина
		else if ( page === 'garbageList') {
			const removedArr = Storage.getRemovedItems()

			for (let i = 0; i < removedArr.length; i++) {
				const place = (removedArr[i].way[removedArr[i].way.length - 1])
				let text
				
				if (place === 'weeks') {
					text = 'Неделя ' + removedArr[i].element.weekNumber
				}
				else if (place === 'workers') {
					text = removedArr[i].element.workerName
				}
				else if (place === 'weekHandOver') {
					text = `${removedArr[i].element.weightWithPercent} ${removedArr[i].element.weaving} ${removedArr[i].element.count}шт.`
				}
				const removedItemButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					type: 'removedItem',
					removedItemName: 
						removedArr[i].element.value 
						|| removedArr[i].element.weavingName 
						|| text ,
					id: removedArr[i].id,
					time: removedArr[i].time
				})
			}

		}

	}

	// перелистываем страницу вперёд
	changeNextPage (currentPageAttr, nextPageAttr, name, weekNumber = '') {
		// если следующая страница и текущая - одна и та же, то отмена
		if (currentPageAttr === nextPageAttr) {
			return
		}

		const containerElement = document.querySelector('[data-container]')
		const currentPageElement = document.querySelector(`[data-page="${currentPageAttr}"]`)
		const nextPageElement = document.querySelector(`[data-page="${nextPageAttr}"]`)

		if (currentPageAttr === 'quotation' && nextPageAttr === 'weavingList') {
			currentPageElement.classList.add('order-previous')
		}
		nextPageElement.classList.remove('hide')
		containerElement.classList.add('nextPage')

		let timeout = 400

		if (nextPageAttr === 'weeksList') {
			this.renderWeekListPage(nextPageAttr, name)

			// если не бригадир, то загружаем вторую страницу без задержки
			timeout = Storage.isBrigadier() ? 400 : 0
		}
		else if (nextPageAttr === 'weekItems') {
			this.renderWeekItemsPage(nextPageAttr, name, weekNumber)
		}
		else if (nextPageAttr === 'handOverItems') {
			this.renderHandOverItemsPage(nextPageAttr, name, weekNumber)
		}
		else if (nextPageAttr === 'weavingList') {
			this.renderWeavingListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}
		else if (nextPageAttr === 'quotation') {
			this.renderQuotationPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}
		else if (nextPageAttr === 'garbageList') {
			this.renderGarbageListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}

		// устанавливаем задержку для плавной прокрутки страниц
		setTimeout( () => {
			currentPageElement.classList.add('hide')
			containerElement.classList.remove('nextPage')
			currentPageElement.classList.remove('order-previous')
		}, timeout)
	}

	// перелистываем страницу назад
	changePreviousPage (currentPageAttr, previousPageAttr, name, weekNumber = '') {

		// если предыдущая страница и текущая - одна и та же, то отмена
		if (currentPageAttr === previousPageAttr) {
			return
		}
		
		const containerElement = document.querySelector('[data-container]')
		const currentPageElement = document.querySelector(`[data-page=${currentPageAttr}]`)
		const previousPageElement = document.querySelector(`[data-page=${previousPageAttr}]`)

		previousPageElement.classList.remove('hide')
		containerElement.classList.add('fromNextToPrevious')
		
		// отрисовываем предыдущую страницу
		if (currentPageAttr === 'weavingList' && previousPageAttr === 'handOverItems') {
			this.renderHandOverItemsPage(previousPageAttr, name, weekNumber)

		} else if (previousPageAttr === 'start') {
			this.renderStartPage('start')

		}
		else if (previousPageAttr === 'weeksList') {
			this.renderWeekListPage(previousPageAttr, name)
			
		}
		else if (previousPageAttr === 'weekItems') {
			this.renderWeekItemsPage(previousPageAttr, name, weekNumber)
			
		}
		else if (previousPageAttr === 'handOverItems') {
			this.renderHandOverItemsPage(previousPageAttr, name, weekNumber)
			
		}
		 else {
			
			this.addFieldList(previousPageAttr, name, weekNumber)
			// this.showFooterValues(previousPageAttr, name, weekNumber)
			// если страница добавили сдачу, то при возвращении назад показываем актуальную сдачу
			if (previousPageAttr === 'weekItems') {

				this.showSalaryValues(previousPageAttr, name, weekNumber)
			}

		}
		
		
		setTimeout( () => {
			containerElement.classList.add('previousPage')
		}, 0)

		setTimeout( () => {
			currentPageElement.classList.add('hide')
			containerElement.classList.remove('previousPage')
			containerElement.classList.remove('fromNextToPrevious')
		}, 400)
	}

	getPreviousPage (currentAttr) {
		const pages = [
			'start',
			'weeksList',
			'weekItems',
			'handOverItems'
		]
		return pages[pages.indexOf(currentAttr) - 1] || ''
	}

	// static showCurrency(page) {
	// 	Page.getCurrency(Page.dataHandler)
	// }

	// делаем API запрос
	static getCurrency (callback) {
		// данные взяты с https://partners.ifxdeal.com/ru/quotes_description.php/
		fetch('https://quotes.instaforex.com/api/quotesTick?m=json&q=silver,gold,usdrub')
			.then(response => response.json())
			.then(data => callback(data))
		
	}

	// обрабатываем API запрос
	static dataHandler (data) {
		const rubPerUsd = data[2].bid
		const usdPerSilverUncia = data[0].bid
		const usdPerGoldUncia = data[1].bid
		const silver = Page.calcPrice(usdPerSilverUncia, rubPerUsd)
		const gold = Page.calcPrice(usdPerGoldUncia, rubPerUsd)
		Page.setCurrencyValue(silver, gold)
		Page.showCurrencyChange (data[0].change, data[1].change)
	}

	// изменяет стрелочки зелёная или красная
	static changeMetallClass (metall, elem) {
		if (metall > 0) {
			elem.classList.remove('metall__change_decrease')
			elem.classList.add('metall__change_increase')
		} else {
			elem.classList.remove('metall__change_increase')
			elem.classList.add('metall__change_decrease')
		}
	}

	// паказываем падает или растёт металл
	static showCurrencyChange (silver, gold) {
		const silverChangeElement = document.querySelector('[data-silver-change]')
		const goldChangeElement = document.querySelector('[data-gold-change]')

		Page.changeMetallClass(silver, silverChangeElement)
		Page.changeMetallClass(gold, goldChangeElement)
		
	}

	// переводим стоимость унции в рубли 
	static calcPrice(metall, usd) {
		return Math.round(metall * usd * 1000000000 / 311034768) / 100
	}
	
	// выводим результаты на страницу
	static setCurrencyValue (silver, gold) {
		const silverMarketElement = document.querySelector('[data-silver-market]')
		const silverSterlingElement = document.querySelector('[data-silver-sterling]')
		const goldMarketElement = document.querySelector('[data-gold-market]')
		const goldSterlingElement = document.querySelector('[data-gold-sterling]')
		
		silverMarketElement.textContent = silver
		goldMarketElement.textContent = gold
		silverSterlingElement.textContent = Math.round(silver * 100 * 925 / 1000) / 100
		goldSterlingElement.textContent = Math.round(gold * 100 * 585 / 1000) / 100
	}

}