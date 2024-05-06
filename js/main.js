const fetchUsersBtn = document.querySelector(".btn");
const userList = document.querySelector(".user-list");
const quantityInput = document.getElementById("quantity");

fetchUsersBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity >= 0) {
        fetchUsers(quantity)
            .then((users) => renderUsers(users))
            .catch((error) => console.log(error));
    }
});

quantityInput.addEventListener("input", () => {
    if (quantityInput.value.trim() === "") {
        quantityInput.value = 0;
    }
});

function fetchUsers(quantity) {
    return fetch(`https://jsonplaceholder.typicode.com/users?_limit=${quantity}`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }
    );
}

function renderUsers(users) {
    const markup = users
        .map((user) => {
            return `<li>
                <p><b>Name</b>: ${user.name}</p>
                <p><b>Email</b>: ${user.email}</p>
                <p><b>Company</b>: ${user.company.name}</p>
            </li>`;
        })
        .join("");
    userList.insertAdjacentHTML("beforeend", markup);
}

//===========================================================================
let settlementsData = [];

function fetchSettlements() {
    fetch('https://6638bcb14253a866a24efcd0.mockapi.io/Lab_4')
        .then(response => response.json())
        .then(data => {
            settlementsData = data;
            renderSettlements(settlementsData);
        })
        .catch(error => console.error('Помилка:', error));
}

function renderSettlements(data) {
    const settlementList = document.getElementById('settlementList');
    settlementList.innerHTML = '';

    data.forEach(settlement => {
        const listItem = document.createElement('li');
        listItem.textContent = `Індекс: ${settlement.id}, Заголовок: ${settlement.title}, Привда: ${settlement.completed ? 'Так' : 'Ні'}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.className = 'deleteButton';
        deleteButton.onclick = function() {
            deleteSettlement(settlement.id);
        };

        listItem.appendChild(deleteButton);
        settlementList.appendChild(listItem);
    });
}


function showAll() {
    renderSettlements(settlementsData);
}

function showTrue() {
    const trueSettlements = settlementsData.filter(settlement => settlement.completed === true);
    renderSettlements(trueSettlements);
}

function showFalse() {
    const falseSettlements = settlementsData.filter(settlement => settlement.completed === false);
    renderSettlements(falseSettlements);
}


function deleteSettlement(id) {
    fetch(`https://6638bcb14253a866a24efcd0.mockapi.io/Lab_4/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log(`Поселення з ID ${id} успішно видалено`);
                fetchSettlements();
            } else {
                console.error(`Помилка при видаленні поселення з ID ${id}`);
            }
        })
        .catch(error => console.error('Помилка:', error));
}

fetchSettlements();

document.getElementById("myForm").addEventListener("submit", function(event){
    event.preventDefault();
    var formData = new FormData(this);
    const title = formData.get('title');
    const completed = formData.get('completed') === 'true';

    fetch('https://6638bcb14253a866a24efcd0.mockapi.io/Lab_4', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            completed: completed
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успішно відправлено:', data);
            // Очищення полів вводу
            document.getElementById('title').value = ''; // Очистка поля "Заголовок"
            document.querySelector('input[name="completed"]:checked').checked = false; // Зняття вибору з радіокнопок
            // Оновлення списку поселень
            fetchSettlements();
        })
        .catch(error => console.error('Помилка:', error));
});

