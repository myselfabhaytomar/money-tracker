document.getElementById('transactionForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;

  fetch('/addTransaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, category }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Transaction added successfully:', data.message);
      fetchTransactions();
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });
});

function fetchTransactions() {
  fetch('/getTransactions')
    .then(response => response.json())
    .then(data => {
      const transactionList = document.getElementById('transactionList');
      transactionList.innerHTML = '';

      data.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `Amount: ${transaction.amount}, Category: ${transaction.category}`;
        transactionList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error retrieving transactions:', error);
    });
}
