import getElementById from './getElementById'
import onLinkClick from './onLinkClick'


export default function configureTableOfContentsVisibility(documentationTab, tableOfContentsTab) {
  configure({ tab: documentationTab, otherTab: tableOfContentsTab })
  configure({ tab: tableOfContentsTab, otherTab: documentationTab })

  // When the user clicks on a table of contents entry, we hide the
  // table of contents.
  onLinkClick(getAssociatedTabPanel(tableOfContentsTab), event => {
    const { tagName } = event.target

    // However, if the user clicks a revealable convention's "reveal"
    // button within a table of contents entry, we want the table of
    // contents remain visible.
    //
    // Each "reveal" button is actually a <label> element associated
    // with an <input> element. When clicking on a label with an
    // associated input element, two click events are generated: one
    // for the label, and the other for the input element. We want
    // to ignore both.
    if (tagName === 'LABEL' || tagName === 'INPUT') {
      return
    }

    select({ tab: documentationTab, otherTab: tableOfContentsTab })
  })
}


function configure(args /* { tab, otherTab } */) {
  args.tab.addEventListener('click', () => select(args))
}


function select(args /* { tab, otherTab } */) {
  const { tab, otherTab } = args

  setSelectedAttribute(tab, 'true')
  setSelectedAttribute(otherTab, 'false')

  getAssociatedTabPanel(tab).style.display = 'block'
  getAssociatedTabPanel(otherTab).style.display = 'none'
}


function setSelectedAttribute(tab, value) {
  tab.setAttribute('aria-selected', value)
}


function getAssociatedTabPanel(tab) {
  return getElementById(tab.getAttribute('aria-controls'))
}
