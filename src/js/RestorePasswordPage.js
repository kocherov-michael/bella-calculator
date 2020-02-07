import Router from './Router'

export default class RestorePasswordPage {
	constructor (args = {}) {
		this.page = 'restorePassword'
		this.renderRestorePage()
		this.listenRestoreButton()
		this.listenBackButton()
	}

	// отрисовываем страницу восстановления пароля
	renderRestorePage() {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)

		currentPageElement.innerHTML = ""
		currentPageElement.innerHTML = 
		`<form class="start-form" >
		<div class="start-form__logo"></div>
		<div class="start-form__input email">
			<input type="email" class="email__text" placeholder="Почта" value="" name="email" data-email-restore>
		</div>

		<button class="start-form__login login-button" data-restore-button>Восстановить</button>
		<div class="start-form__forgot" data-back-button>Назад</div>
	</form>`
	}

	// прослушка кнопки Восстановить
	listenRestoreButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const restoreButtonElement = currentPageElement.querySelector(`[data-restore-button]`)
		const restoreInputElement = currentPageElement.querySelector(`[data-email-restore]`)

		restoreButtonElement.addEventListener('click', (event) => {

			event.preventDefault()

			// проверяем корректность email
			const userEmail = LoginPage.validate(restoreInputElement)
			if (!userEmail) return
			
			// показываем окно с уведомлением об отправке
			this.showNotice()

			// отправляем асинхронно запрос
			;(async () => {
				let response = await fetch('assets/php/restorePassword.php', {
					method: 'post', 
					body: JSON.stringify( {userEmail: restoreInputElement.value} ),
					headers: {
						'content-type': 'application/json'
					}
				})

				let answer = await response.json()
				// let answer = await response.text()
				
				if (answer === 'wrong email') {
					this.mistakeNotice('Почта не зарегистрирована')
				}
				else if (answer === 'error') {
					this.mistakeNotice('Ошибка отправки')
				}
				
			})()
			Router.changePreviousPage(this.page, 'login', '')
		})
	}

	// прослушка кнопки Назад
	listenBackButton () {
		
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const backButtonElement = currentPageElement.querySelector(`[data-back-button]`)

		backButtonElement.addEventListener('click', () => {

			Router.changePreviousPage(this.page, 'login', '')
		})
	}

	// показать уведомление, что пароль отправлен на почту
	showNotice () {
		// const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const noticeWrapperElement = document.createElement('div')
		noticeWrapperElement.classList.add('form-container', 'restore-notice')
		noticeWrapperElement.setAttribute('data-notice', '')
		
		noticeWrapperElement.innerHTML = 
		`<div class="form active-form" data-notice-form>
			<div class="form__heading" data-notice-text>
					Пароль отправлен на почту
			</div>
			<div class="form__buttons">
			
				<div class="form__buttons-cancel">
					<button class="item item_warning" data-close-button>
						<div class="item__header">
							<div class="item__header-text">Закрыть</div>
							<div class="item__header-arrow">
								<div class="cross">&#10006;</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>`

		document.body.append(noticeWrapperElement)
		// noticeElement.classList.remove('opacity')
		const closeButtonElement = noticeWrapperElement.querySelector('[data-close-button]')
		const noticeElement = noticeWrapperElement.querySelector('[data-notice-form]')

		closeButtonElement.addEventListener('click', () => {
			noticeElement.classList.add('opacity')
			noticeWrapperElement.classList.add('opacity')
			setTimeout( () => {
				noticeWrapperElement.parentNode.removeChild(noticeWrapperElement)
			}, 400)
		})
	}

	// изменить уведомление
	mistakeNotice(text) {
		const noticeTextElement = document.querySelector('[data-notice-text]')
		noticeTextElement.textContent = text
	}
}