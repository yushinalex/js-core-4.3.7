const search = document.querySelector('.search');
const input = document.querySelector('.search__input');
const message = document.createElement('span');
message.classList.add('search__message');
message.textContent = 'not found';
const chosen = document.querySelector('.chosen');
let searchList = document.createElement('ul');
const chosenList = document.createElement('ul');

function createSearchList(array) {
    array = array.slice(0, 5);

    if (array.length === 0) {
        search.append(message);
    } else {
        message.remove();
    }

    if (searchList.classList.contains('search__list')) {
        searchList.remove();
        searchList = document.createElement('ul');
    }

    searchList.classList.add('search__list');
    search.append(searchList);

    array.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('search__item');
        searchList.append(li);
        li.textContent = `${item.name}`;
        li.addEventListener('click', function () {
            createChosenList(item);
            input.value = '';
            searchList.remove();
        });
    });
}

function createChosenList(item) {
    chosenList.classList.add('chosen__list');
    chosen.append(chosenList);
    const li = document.createElement('li');
    li.classList.add('chosen__item');
    chosenList.append(li);
    const p = document.createElement('p');
    p.classList.add('chosen__text');
    li.append(p);
    p.textContent = `Name: ${item.name}\nOwner: ${item.owner.login}\nStars: ${item.stargazers_count}`;
    const btn = document.createElement('btn');
    btn.classList.add('chosen__btn');
    li.append(btn);
}

const debounce = (fn, debounceTime) => {
    let timeout;
    return function () {
        const callFn = () => fn.apply(this, arguments);

        clearTimeout(timeout);

        timeout = setTimeout(callFn, debounceTime);
    };
};

async function searchRep(value) {
    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=${value}`
        );
        if (response.status !== 200) {
            throw new Error(
                response.status + ' Try a bit later, git hub is lagging...'
            );
        }
        const res = await response.json();
        console.log(res.items);

        return Promise.resolve(res.items);
    } catch (err) {
        alert(err);
    }
}

async function createResultList(value) {
    let res = await searchRep(value);
    createSearchList(res);
}

let slowSearch = debounce(createResultList, 400);

function repoSearch(e) {
    let value = e.target.value;
    if (value) {
        slowSearch(value);
    } else {
        message.remove();
        searchList.remove();
    }
}

function removeChosen(e) {
    let target = e.target;
    let el = target.parentElement;
    el.remove();
}

input.addEventListener('keyup', repoSearch);

chosen.addEventListener('click', removeChosen);
