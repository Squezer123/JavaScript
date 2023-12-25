
let receiptData;

document.addEventListener('DOMContentLoaded', function () {
    receiptData = JSON.parse(localStorage.getItem('receiptData')) || [];

    generateReceiptView();

    window.openAddDialog = function () {
        document.getElementById('addDialog').style.display = 'block';
    };

    window.closeAddDialog = function () {
        document.getElementById('addDialog').style.display = 'none';
    };

    window.addItem = function () {
        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value);

        if (!itemName || isNaN(itemPrice) || isNaN(itemQuantity) || itemPrice < 0 || itemQuantity < 1) {
            alert('Proszę wprowadzić poprawne dane.');
            return;
        }

        const newItem = { name: itemName, price: itemPrice, quantity: itemQuantity };
        receiptData.push(newItem);

        saveReceiptData();

        generateReceiptView();

        closeAddDialog();
    };


});

function generateReceiptView() {
    const receiptTable = document.getElementById('receiptTable');
    receiptTable.innerHTML = '';

    const headerRow = receiptTable.insertRow();
    headerRow.innerHTML = '<th>Nazwa</th><th>Cena jednostkowa</th><th>Ilość</th><th>Wartość</th><th>Akcje</th>';

    let totalAmount = 0;
    receiptData.forEach((item, index) => {
        const row = receiptTable.insertRow();
        const cellName = row.insertCell(0);
        const cellPrice = row.insertCell(1);
        const cellQuantity = row.insertCell(2);
        const cellAmount = row.insertCell(3);
        const cellActions = row.insertCell(4);

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.value = item.name;

        const inputPrice = document.createElement('input');
        inputPrice.type = 'number';
        inputPrice.min = '0';
        inputPrice.value = item.price;

        const inputQuantity = document.createElement('input');
        inputQuantity.type = 'number';
        inputQuantity.min = '1';
        inputQuantity.value = item.quantity;

        cellName.appendChild(inputName);
        cellPrice.appendChild(inputPrice);
        cellQuantity.appendChild(inputQuantity);

        const itemAmount = item.price * item.quantity;
        cellAmount.innerText = itemAmount.toFixed(2);
        totalAmount += itemAmount;

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Zapisz';
        saveButton.onclick = function () {
            item.name = inputName.value;
            item.price = parseFloat(inputPrice.value);
            item.quantity = parseInt(inputQuantity.value);

            saveReceiptData();

            generateReceiptView();
        };

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Anuluj';
        cancelButton.onclick = function () {
            generateReceiptView();
        };

        const editButton = document.createElement('button');
        editButton.innerText = 'Edytuj';
        editButton.onclick = function () {
            editButton.disabled = true;

            cellName.innerHTML = '';
            cellPrice.innerHTML = '';
            cellQuantity.innerHTML = '';

            cellName.appendChild(inputName);
            cellPrice.appendChild(inputPrice);
            cellQuantity.appendChild(inputQuantity);

            cellActions.innerHTML = '';
            cellActions.appendChild(saveButton);
            cellActions.appendChild(cancelButton);
        };

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Usuń';
        deleteButton.onclick = function () {
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                receiptData.splice(index, 1);
                saveReceiptData();
                generateReceiptView();
            }
        };

        cellActions.appendChild(editButton);
        cellActions.appendChild(deleteButton);
    });

    const totalRow = receiptTable.insertRow();
    totalRow.innerHTML = `<td colspan="3" style="text-align: right;"><b>Suma:</b></td><td>${totalAmount.toFixed(2)}</td><td></td>`;
}

function saveReceiptData() {
    localStorage.setItem('receiptData', JSON.stringify(receiptData));
}

