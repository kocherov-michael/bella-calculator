export default class Handler {
	constructor (args = {}) {
		

		if (args.menu) {
			this.menuHandler(args.menu)
		}
	}
	menuHandler (x) {
		const sectionElement =  document.querySelector(x)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')

		headerMenuElement.addEventListener('click', () => {
			
			console.log('click')
			// headerMenuListElement.classList.remove('hide')
			headerMenuListElement.classList.toggle('menu-show')
		} )
	}

}