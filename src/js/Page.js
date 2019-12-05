import Handler from './Handler'
import Item from './Item'
import Storage from './Storage'

export default class Page {
	constructor (args = {}) {
		this.storage = new Storage()
		this.pages = [
			'start',
			'weeksList'
		]
		console.log('page')

		if (args.start) {
			this.renderPage(args.start)
		}
	}

	renderPage (page, name = '') {
		this.addArrowBack(page)
		this.addCreateButton(page, name)
		this.addForm(page, name)

		const handler = new Handler({
			menu: page,
			addItem: page,
			workerName: name,
			backButton: page
		})
		
		this.addFieldList(page, name)
		this.showHeaderName(page, name)

	}

	// Добавить форму
	addForm (page, name) {
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)

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

	// добавить стрелку назад
	addArrowBack(page){
		const headerElement = document.querySelector(`[data-header="${page}"]`)
		
		// получаем аттрибут предыдущей страницы
		const previousPage = this.pages[this.pages.indexOf(page) - 1] || ''

		headerElement.innerHTML = ''
		headerElement.innerHTML = 
		`<div class="header__nav">
		<div class="header__arrow" data-header-back="${previousPage}"></div>
		<div class="header__text" data-header-text="${page}"></div>
		<div class="header__menu" data-header-menu="${page}">
			<div class="menu-icon">
				<div class="menu-icon__line"></div>
			</div>
		</div>
		<div class="menu" data-menu-list>
			<button class="menu__item">Котировки</button>
			<button class="menu__item">Плетения</button>
			<button class="menu__item">Восстановить удаления</button>
		</div>
	</div>`

	// если не стартовая страница, то добавляем стрелку
		if (page !== 'start') {
			const headerArrowElement = document.querySelector(`[data-header-back="${previousPage}"]`)
			const imgArrowElement = document.createElement('img')
			imgArrowElement.setAttribute('src', 'assets/img/arrow.svg')
			imgArrowElement.setAttribute('alt', 'назад')
			headerArrowElement.append(imgArrowElement)
		}

	}

	// показать текст в шапке
	showHeaderName (page, name) {
		const headerTextElement = document.querySelector(`[data-header-text="${page}"]`)
		if (headerTextElement) {
			headerTextElement.textContent = name
		}
	}
	

	// Создаём список элементов из памяти
	addFieldList (page, name = '') {
		// console.log(page)
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const data = this.storage.read()
	
		// если страница стартовая
		if (page === 'start') {

			data.forEach( (worker) => {
				
				const workerButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// имя работника
					text: worker.workerName,
					type: 'single'
				})
			})
		}
		// если страница с неделями
		else if ( page === 'weeksList') {
			// console.log(data)
			for( let i = 0; i < data.length; i++) {
				if ( data[i].workerName === name) {
					// console.log(data[i].weeks)
					data[i].weeks.forEach( (week) => {
				
						const weekButton = new Item({
							// родительский элемент
							field: itemFieldElement,
							// номер недели
							text: week.weekNumber,
							type: 'week'
						})
					})
				}
			}
		}

	}

	// перелистываем страницу вперёд
	changeNextPage (workerObj, currentPage, nextPage, name) {
		// console.log('next')
		
		const containerElement = document.querySelector('[data-container]')

		nextPage.classList.remove('hide')
		containerElement.classList.add('nextPage')

		const nextAttr = nextPage.getAttribute('data-page')
		// this.addFieldList(nextAttr, name)
		this.renderPage(nextAttr, name)
		
		setTimeout( () => {
			currentPage.classList.add('hide')
			containerElement.classList.remove('nextPage')
		}, 400)
		// console.log(this)
	}

	// перелистываем страницу назад
	changePreviousPage (workerObj, currentPage, previousPage, name) {
		
		const containerElement = document.querySelector('[data-container]')

		previousPage.classList.remove('hide')
		containerElement.classList.add('fromNextToPrevious')
		
		const previousAttr = previousPage.getAttribute('data-page')
		// отрисовываем предыдущую страницу
		// this.renderPage(previousAttr, name)
		this.addFieldList(previousAttr, name)
		
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

}