import PageHandler from './PageHandler'
import Router from './Router'
import LocalStorage from './LocalStorage'

export default class DefaultPage extends PageHandler {
	constructor (args = {}) {
		super(args)
	}

	// создаём шапку
	// 
	createHeader (args) {
		
		const {page, workerName = '', weekNumber = ''} = args
		const headerElement = document.querySelector(`[data-header="${page}"]`)
		const checked = LocalStorage.isBrigadier() ? 'checked' : ''

		let optionTemplate = ''
		const fontSize = LocalStorage.fontSize()
		document.body.style = `font-size: ${fontSize}px`

		for (let size = 10; size <= 20; size += 2 ) {
			let selected = ''
			if ( size == fontSize ) {
				selected = 'selected'
			}
			optionTemplate += `<option class="option" value="${size}" ${selected}>${size}</option>`
		}
		
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
			<label class="menu__item font-select">
				<select class="font-select__select" type="select" data-font-size>
					${optionTemplate}
				</select>
				<div class="font-select__text">Размер шрифта</div>
			</label>
			<button class="menu__item" data-next="quotation" data-quotation-link="${page}">Котировки</button>
			<button class="menu__item" data-next="weavingList"
			data-weaving-link="${page}">Плетения</button>
			<button class="menu__item" data-garbage-link="${page}">Восстановить удаления</button>
			<button class="menu__item" data-data-base="${page}">Копировать БД</button>
			<button class="menu__item" data-paste-data-base="${page}">Вставить БД</button>
			<label class="menu__item check">
				<input class="check__input" type="checkbox" data-check-brigadier ${checked}>
				<div class="check__box">
					<div class="check__box-item"></div>
				</div>
				Я бригадир
			</label>
			
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
		const fontSizeElement = sectionElement.querySelector('[data-font-size]')
		const copyBaseElement = sectionElement.querySelector('[data-data-base]')
		const pasteBaseElement = sectionElement.querySelector('[data-paste-data-base]')

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

		// селект font-size
		fontSizeElement.addEventListener('change', () => {
			document.body.style = `font-size: ${fontSizeElement.value}px`
			LocalStorage.fontSize(fontSizeElement.value)
		})

		copyBaseElement.addEventListener('click', function () {
			//нашли наш контейнер
			const string = localStorage.getItem('bella-calculator')
			const textareaElement = document.createElement('textarea')
			textareaElement.innerHTML = string
			textareaElement.style = 'position: absolute; top: 0; left: 0; z-index: -999;'
			document.body.append(textareaElement)
			
			let selection = window.getSelection()
			
			if (selection.rangeCount > 0) {
				selection.removeAllRanges();
			}
			
			//производим выделение
			let range = document.createRange();
			range.selectNode(textareaElement);
			selection.addRange(range);
		 
			//пытаемся скопировать текст в буфер обмена
			try { 
				document.execCommand('copy'); 
			} catch(err) { 
				console.log('Can`t copy, boss'); 
			} 
			//очистим выделение текста, чтобы пользователь "не парился"
			window.getSelection().removeAllRanges();
			textareaElement.parentNode.removeChild(textareaElement)
		})

		pasteBaseElement.addEventListener('click', () => {
			const wrapperElement = document.createElement('div')
			wrapperElement.style = 'position: absolute; top: 0; left: 0; bottom: 0; right: 0; background-color: rgba(58,58,58,.9); z-index: 999;'
			const inputElement = document.createElement('input')
			inputElement.style = 'position: absolute; top: 50px; left: 10%; height: 40px; width: 80%;'
			inputElement.placeholder = 'вставить скопированную базу сюда'
			wrapperElement.append(inputElement)
			document.body.append(wrapperElement)

			inputElement.addEventListener('input', () => {
				localStorage.setItem('bella-calculator', inputElement.value)
				wrapperElement.parentNode.removeChild(wrapperElement)
				Router.loadPage({page: 'weeksList'})
			})
		})




	}

	// создаём кнопку добавления
	// 
	addCreateButton(args) {
		const { page, workerName = name, text, weekNumber } = args

		const fieldElement = document.querySelector(`[data-add-item="${page}"]`)

		fieldElement.innerHTML = ''

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
			workerName,
			addButtonElement
		})
	}

	// добавляем в шапку стрелку назад
	// 
	createHeaderBackArrow (page, previousPage = '', weekNumber = '', workerName = '') {
		const headerNavElement = document.querySelector(`[data-header-nav="${page}"]`)

		// создаём элемент стрелки назад в шапке
		const arrowBackElement = document.createElement('div')
		
		arrowBackElement.classList.add('header__arrow')
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

			Router.changePreviousPage(page, previousPage, weekNumber, workerName)
		})

	}

	// показать текст в шапке
	// 
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

	

	// создаём форму добавления простой операции в футере
	// 
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
}