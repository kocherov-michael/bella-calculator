

		function f(){operationElement.addEventListener("touchmove", handleMove )
		
		const touchArray = []
		let firstTapPosition = null

		function handleMove (event) {
			let touchPoint = event.changedTouches[0].pageX
			if (!firstTapPosition) {
				firstTapPosition = touchPoint
			}
			touchArray.push(touchPoint)

			let difference = touchPoint - firstTapPosition
			const innerDiv = this.querySelector('[data-string]')
			const buttonEditElement = this.querySelector('[data-change-operation]')
			const operationId = parseInt(buttonEditElement.getAttribute('data-change-operation'))
			console.log(operationId)

			if ( difference > 20) {
				this.style.overflow = 'hidden'
				innerDiv.style.marginLeft = (String(difference) + 'px')
				innerDiv.style.marginRight = ('-' + String(difference) + 'px')
				let diff = String(difference)

				// Удаляем элемент операции
				if ( difference > 200 ) {
					innerDiv.style.opacity = '0'
					let elemHeight = parseFloat(getComputedStyle(this, null).height.replace("px", ""))
					this.style.height = `${elemHeight}px`

					const hideOperation = setInterval( () => {
						let height = parseInt(this.style.height.replace("px", ""))
						height -= 1
				        this.style.height = `${height}px`

				        if (height <=0) {
				        	clearInterval(hideOperation)
				        	for(let i=0; i <operationsArray.length; i++) {
								if (operationsArray[i].id === operationId) {
									operationsArray.splice(i, 1)

									addToDB(operationsArray, loggedUser)
									renderFromDB ()
								}
							}
				        }
					}, 10)
				}
			}

			operationElement.addEventListener("touchend", () => {
				touchArray.length = 0
				firstTapPosition = null
				innerDiv.style.marginLeft = ''
				innerDiv.style.marginRight = ''
			})
		}
	}

// import './js/common'
// import './css/main.css'
import './scss/main.scss'



import Page from './js/Page'
const page = new Page({
	start: 'start'
})
