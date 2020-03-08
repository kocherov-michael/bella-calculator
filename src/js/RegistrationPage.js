import LocalStorage from './LocalStorage'
import Router from './Router'
import LoginPage from './LoginPage'

export default class RegistrationPage {
	constructor (args = {}) {
		
		this.page = 'registration'
		this.renderRegistrationPage()
		this.listenLoginPage()
	}

	// отрисовываем страницу регистрации
	renderRegistrationPage() {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)

		currentPageElement.innerHTML = ""
		currentPageElement.innerHTML = 
		`<form class="start-form">
		<div class="start-form__logo"></div>
		<div class="start-form__input email">
			<input type="email" class="email__text" placeholder="Почта" value="" name="email" data-email-registration>
		</div>

		<div class="start-form__input password">
			<input type="password" class="password__text" placeholder="Пароль" value="" name="password" data-password-registration>
			<div class="password__eye hide-password" data-eye>
				<img src="assets/img/open_eye.svg" class="password-is-hidden" alt="show">
				<img src="assets/img/closed_eye.svg" class="password-is-visible" alt="hide">
			</div>
		</div>
		<button class="start-form__login login-button" data-registration-button>Зарегистрироваться</button>
	</form>
	<button class="start-form__registration login-button login-button_color_secondary" data-login-button>Войти</button>`
	}

	// показать прелоадер загрузки страницы
	preloaderShow () {
		const wrapperElement = document.querySelector('[data-wrapper]')
		wrapperElement.classList.add('wrapper--show-load')	
	}

	// скрыть прелоадер
	preloaderHide () {
		const wrapperElement = document.querySelector('[data-wrapper]')
		wrapperElement.classList.remove('wrapper--show-load')
	}

	listenLoginPage () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)
		const registrationEmailElement = currentPageElement.querySelector(`[data-email-registration]`)
		const registrationPasswordElement = currentPageElement.querySelector(`[data-password-registration]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)
		const eyePasswordElement = currentPageElement.querySelector(`[data-eye]`)

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// проверка валидности и заполненности почты
			const userEmail = LoginPage.validate(registrationEmailElement)
			if (!userEmail) {
				return
			}
			// проверка заполненности пароля
			const userPassword = LoginPage.isNotEmpty(registrationPasswordElement, 'Введите пароль')
			if (!userPassword) {
				return
			}
			
			const userObj = {userEmail, userPassword}

			// показываем сообщение о загрузке
			this.preloaderShow()
			
			fetch('assets/php/registration.php', {
				method: 'post', 
				body: JSON.stringify(userObj),
				headers: {
					'content-type': 'application/json'
				}
			})
			// .then(response => response.text())
			// .then(text => console.log(text))
				.then(response => response.json())
				.then(result => {
					
					if (result === 'exist') {
						LoginPage.showInputError(registrationEmailElement, 'Почта уже зарегистрирована')
					}
					
					else if (result === 'success') {
						const result = LocalStorage.registerUser(userObj)

						// убираем сообщение о загрузке
						this.preloaderHide()
						
						Router.changeNextPage({
							currentPageAttr: 'registration', 
							nextPageAttr: 'weeksList', 
							weekNumber: ''
						})
					}
					// читаем объект, который был до регистрации
					const dataObj = LocalStorage.read()
					// Сохраняем его в облако
					LocalStorage.save(dataObj)

				})
				
				

		})

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'login', 
				weekNumber: ''
			})
		})

		LoginPage.showHidePassword(eyePasswordElement, registrationPasswordElement)
	}

}