let currentPageUrl = ''
let nextPageUrl = ''
let previousPageUrl = ''

export const initMenuAndSearch = () => {
    const menuItems = document.querySelectorAll('#menu a')
    const searchInput = document.getElementById('search')

    menuItems.forEach(item => item.addEventListener('click', handleMenuClick))
    searchInput.addEventListener('input', handleSearch)
}

export const handleMenuClick = async (event) => {
    event.preventDefault()
    const entity = event.target.dataset.entity
    currentPageUrl = `https://swapi.py4e.com/api/${entity}/`
    await loadEntityList(currentPageUrl)
}

export const loadEntityList = async (url) => {
    const content = document.getElementById('content')
    const loader = document.getElementById('loader')

    try {
        showLoader(loader)
        const data = await fetchDataWithErrors(url)
        nextPageUrl = data.next
        previousPageUrl = data.previous
        displayEntityList(data.results, url.split('/').slice(-2, -1)[0], content)
        displayPagination()
    } catch (error) {
        displayError(error, content)
    } finally {
        hideLoader(loader)
    }
}

export const displayEntityList = (entities, entity, content) => {
    content.innerHTML = `
        <h2>${capitalize(entity)}</h2>
        <ul>
            ${entities.map(item => `<li data-url="${item.url}">${item.name || item.title}</li>`).join('')}
        </ul>
    `
    initEntityListItems(content)
}

export const initEntityListItems = (content) => {
    const listItems = content.querySelectorAll('li')
    listItems.forEach(item => item.addEventListener('click', handleEntityClick))
}

export const handleEntityClick = async (event) => {

    const url = event.target.dataset.url
    const content = document.getElementById('content')
    const loader = document.getElementById('loader')

    try {
        showLoader(loader)
        const data = await fetchDataWithErrors(url)
        displayEntityDetail(data, content)
    } catch (error) {
        displayError(error, content)
    } finally {
        hideLoader(loader)
    }
}

export const displayEntityDetail = (entity, content) => {
    content.innerHTML = `
        <h2>${entity.name || entity.title}</h2>
        <pre>${JSON.stringify(entity, null, 2)}</pre>
        <p>This entity has ${Object.keys(entity).length} properties.</p>
        <button id="back">Back</button>
    `
    initBackButton()
}

export const initBackButton = () => {
    document.getElementById('back').addEventListener('click', () => {
        loadEntityList(currentPageUrl)
    })
}

export const handleSearch = (event) => {
    const query = event.target.value.toLowerCase()
    const content = document.getElementById('content')
    const listItems = content.querySelectorAll('li')
    listItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(query)) {
            item.style.display = ''
        } else item.style.display = 'none'
    })
}

export const fetchDataWithErrors = async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const displayPagination = () => {
    const paginationElement = document.getElementById('pagination')
    paginationElement.innerHTML = `
            ${previousPageUrl ? '<button id="previous" class="previous">Previous</button>' : ''}
            ${nextPageUrl ? '<button id="next" class="next">Next</button>' : ''}
    `
    initPaginationButtons()
}

export const initPaginationButtons = () => {
    if (previousPageUrl) {
        document.getElementById('previous').addEventListener('click', () => loadEntityList(previousPageUrl))
    }
    if (nextPageUrl) {
        document.getElementById('next').addEventListener('click', () => loadEntityList(nextPageUrl))
    }
}

export const showLoader = (loader) => loader.style.display = 'block'
export const hideLoader = (loader) => loader.style.display = 'none'
export const displayError = (error, content) => content.innerHTML = `<div id="error">Error: ${error.message}</div>`

document.addEventListener('DOMContentLoaded', initMenuAndSearch)
