import './style/app.scss'
import getElementById from './getElementById'
import configureEditor from './configureEditor'
import configureTableOfContentsVisibility from './configureTableOfContentsVisibility'
import isOnIosDevice from './isOnIosDevice'


document.addEventListener('DOMContentLoaded', () => {
  const editorContainerElement = getElementById('editor-container')
  const documentationContainerElement = getElementById('documentation-container')

  // We use `position: fixed` for the editor container, which has fairly poor support on iOS.
  // Therefore, for the time being, we're hiding the editor on all iOS devices.
  //
  // We *could* use flexbox for our layout instead, which would give us a scrollable panel
  // for both the editor and the documentation. Unfortunately, that comes with its own set of
  // issues. When the documentation is placed in a scrollable panel, most browsers' back
  // and forward buttons cease to have any effect, at least as far as intra-page navigation
  // is concerned. We could fix *that* by using the HTML5 history API, but each browser
  // handles those events slightly differently, particularly Microsoft Edge.
  //
  // We'll revisit this decision as support for `position: fixed` improves on iOS.  
  if (isOnIosDevice()) {
    // These changes should match the `on-small-screens` media query in `layout.scss`.
    editorContainerElement.style.display = 'none'
    documentationContainerElement.style.marginLeft = 0
  } else {
    configureEditor({
      editorContainerElement,
      documentationContainerElement,
      documentationScrollerElement: document.documentElement,
      documentationElement: getElementById('documentation'),
      tableOfContentsElement: getElementById('table-of-contents')
    })
  }

  configureTableOfContentsVisibility(
    getElementById('show-documentation'),
    getElementById('show-table-of-contents'))

  // If an element has an explicit tab index, it's meant to be interactable with a keyboard.
  //
  // Here, we make these elements clickable using the enter key or space bar.
  documentationContainerElement.addEventListener('keydown', event => {
    const element = event.target
    const ENTER_KEY = 13
    const SPACE_KEY = 32

    if (element.hasAttribute('tabindex') && [ENTER_KEY, SPACE_KEY].indexOf(event.keyCode) !== -1) {
      event.preventDefault()
      element.click()
    }
  })
})
