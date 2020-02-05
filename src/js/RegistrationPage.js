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
		this.listenRegistrationButton()
		this.listenLoginButton()
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
			<div class="password__eye" data-eye>
				<img src="assets/img/open_eye.svg" class="password-is-hidden" alt="show">
				<img src="assets/img/closed_eye.svg" class="password-is-visible" alt="hide">
			</div>
		</div>
		<button class="start-form__login login-button" data-registration-button>Зарегистрироваться</button>
	</form>
	<button class="start-form__registration login-button login-button_color_secondary" data-login-button>Войти</button>`
	}

	listenRegistrationButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)
		const registrationEmailElement = currentPageElement.querySelector(`[data-email-registration]`)
		const registrationPasswordElement = currentPageElement.querySelector(`[data-password-registration]`)

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log(registrationEmailElement.value)
			// console.log(registrationPasswordElement.value)
			const correctEmail = LoginPage.validate(registrationEmailElement.value)

			if (!correctEmail) {
				const registrationContainerElement = registrationEmailElement.closest('.email')
				registrationContainerElement.setAttribute('data-error', 'Адрес почты не корректен')
				registrationContainerElement.classList.add('error')

				// прослушиваем ввод текста в инпут чтобы убрать ошибку
				registrationEmailElement.addEventListener('input', () => {
					registrationContainerElement.classList.remove('error')
				})
			}
			// registrationEmailElement.value

			// localStorage.setItem('bella-user', JSON.stringify(dataObj))

			// Router.changeNextPage({
			// 	currentPageAttr: this.page, 
			// 	nextPageAttr: 'weeksList', 
			// 	weekNumber: ''
			// })
		})
	}

	listenLoginButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'login', 
				weekNumber: ''
			})
		})
	}
}