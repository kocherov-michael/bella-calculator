import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import Router from './Router'
import LoginPage from './LoginPage'

export default class RegistrationPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = 'registration'
		// this.checkLoggedUser()
		this.renderRegistrationPage()
		// this.listenRegistrationButton()
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

	listenLoginPage () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)
		const registrationEmailElement = currentPageElement.querySelector(`[data-email-registration]`)
		const registrationPasswordElement = currentPageElement.querySelector(`[data-password-registration]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)
		const eyePasswordElement = currentPageElement.querySelector(`[data-eye]`)

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			
			const userEmail = LoginPage.validate(registrationEmailElement)
			if (!userEmail) {
				return
			}

			const userPassword = LoginPage.isNotEmpty(registrationPasswordElement)
			// console.log(userPassword)
			if (!userPassword) {
				return
			}
			const userObj = {userEmail, userPassword}
			// console.log(userObj)
			const result = LocalStorage.registerUser(userObj)

			if (result) {
				
				Router.changeNextPage({
					currentPageAttr: this.page, 
					nextPageAttr: 'weeksList', 
					weekNumber: ''
				})
			}

			// localStorage.setItem('bella-user', JSON.stringify(dataObj))

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