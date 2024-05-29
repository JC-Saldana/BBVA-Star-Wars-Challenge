const {
    handleMenuClick,
    loadEntityList,
    displayEntityList,
    initEntityListItems,
    handleEntityClick,
    displayEntityDetail,
    displayPagination
} = require('./main.js');


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            results: [{ name: 'Luke Skywalker', url: 'https://swapi.py4e.com/api/people/1/' }],
            next: 'https://swapi.py4e.com/api/people/?page=2',
            previous: null
        }),
    })
);

beforeEach(() => {
    document.body.innerHTML = `
      <div id="menu">
        <a href="#" data-entity="people">People</a>
        <a href="#" data-entity="planets">Planets</a>
      </div>
      <input id="search" type="text">
      <div id="content"></div>
      <div id="loader" style="display: none;"></div>
      <div id="pagination"></div>
    `;
});

afterEach(() => jest.clearAllMocks());

test('handleMenuClick', async () => {
    const event = { preventDefault: jest.fn(), target: { dataset: { entity: 'people' } } };
    await handleMenuClick(event);
    expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/');
});

test('loadEntityList displays entities and pagination', async () => {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');
    await loadEntityList('https://swapi.py4e.com/api/people/');
    expect(loader.style.display).toBe('none');
    expect(content.innerHTML).toContain('Luke Skywalker');
    expect(document.getElementById('pagination').innerHTML).toContain('Next');
});

test('displayEntityList renders entities', () => {
    const content = document.getElementById('content');
    displayEntityList([{ name: 'Luke Skywalker', url: 'https://swapi.py4e.com/api/people/1/' }], 'people', content);
});

test('initEntityListItems initializes entity list items', () => {
    const content = document.getElementById('content');
    content.innerHTML = '<ul><li data-url="https://swapi.py4e.com/api/people/1/">Luke Skywalker</li></ul>';
    initEntityListItems(content);
});

test('handleEntityClick loads entity detail', async () => {
    const content = document.getElementById('content');
    const event = { target: { dataset: { url: 'https://swapi.py4e.com/api/people/1/' } } };
    await handleEntityClick(event);
    expect(content.innerHTML).toContain('Luke Skywalker');
});

test('displayEntityDetail renders entity detail', () => {
    const content = document.getElementById('content');
    displayEntityDetail({ name: 'Luke Skywalker' }, content);
});

test('displayPagination renders pagination buttons', () => {
    displayPagination();
});
