document
  .getElementById('search-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const searchInput = document.getElementById('search-input').value.trim();

    if (searchInput === '') {
      alert('Please enter a search term.');
      return;
    }

    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    console.log(customers);
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.customerName.includes(searchInput) ||
        customer.deviceId === +searchInput
    );

    displayResults(filteredCustomers);
    updateStatusCounts();
  });

function displayResults(customers) {
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (customers.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }

  customers.forEach((customer, index) => {
    const customerDiv = document.createElement('div');
    customerDiv.classList.add('customer-item');

    customerDiv.innerHTML = `
        <h3>Customer ${index + 1}</h3>
        <p><strong>Name:</strong> <input type="text" value="${
          customer.customerName
        }" id="customer-name-${index}" /></p>
        <p><strong>Phone Number:</strong> <input type="text" value="${
          customer.customerPhoneNumber
        }" id="customer-phone-${index}" /></p>
        <p><strong>Device Category:</strong> ${customer.deviceCategory}</p>
        <p><strong>Issue:</strong> ${customer.issue}</p>
        <p><strong>Status:</strong> <select id="customer-status-${index}">
            <option value="waiting" ${
              customer.status === 'waiting' ? 'selected' : ''
            }>Waiting</option>
            <option value="between" ${
              customer.status === 'between' ? 'selected' : ''
            }>Between</option>
            <option value="done" ${
              customer.status === 'done' ? 'selected' : ''
            }>Done 
            </option>
            
          </select>
        </p>
        <button onclick="updateCustomer(${index})">Save</button>
        <button onclick="deleteCustomer(${index})">Delete</button>
        <hr/>
      `;
    resultsDiv.appendChild(customerDiv);
    updateStatusCounts(); // Update status counts after adding a new customer
  });
}

function updateCustomer(index) {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];

  const updatedName = document.getElementById(`customer-name-${index}`).value;
  const updatedPhone = document.getElementById(`customer-phone-${index}`).value;
  const updatedStatus = document.getElementById(
    `customer-status-${index}`
  ).value;

  // Update the customer data
  customers[index].customerName = updatedName;
  customers[index].customerPhoneNumber = updatedPhone;
  customers[index].status = updatedStatus;

  // Save the updated data to localStorage
  localStorage.setItem('customers', JSON.stringify(customers));
  alert('Customer data updated!');
}

function deleteCustomer(index) {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];

  if (confirm('Are you sure you want to delete this customer?')) {
    customers.splice(index, 1);
    localStorage.setItem('customers', JSON.stringify(customers));
    alert('Customer deleted!');
    displayResults(customers); // Refresh the results
  }
}
document.querySelectorAll('.status-link').forEach((link) => {
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent page reload

    // Get the class of the clicked link to identify status
    const clickedClass = event.target.classList;
    const customers = JSON.parse(localStorage.getItem('customers')) || [];

    let filteredCustomers = [];

    // Filter customers based on status
    if (clickedClass.contains('done-status')) {
      filteredCustomers = customers.filter(
        (customer) => customer.status === 'done'
      );
    } else if (clickedClass.contains('waiting-status')) {
      filteredCustomers = customers.filter(
        (customer) => customer.status === 'waiting'
      );
    } else if (clickedClass.contains('between-status')) {
      filteredCustomers = customers.filter(
        (customer) => customer.status === 'between'
      );
    }

    // Display the filtered customers
    displayResults(filteredCustomers);
  });
});

function updateStatusCounts() {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];

  const doneCount = customers.filter(
    (customer) => customer.status === 'done'
  ).length;
  const waitingCount = customers.filter(
    (customer) => customer.status === 'waiting'
  ).length;
  const betweenCount = customers.filter(
    (customer) => customer.status === 'between'
  ).length;

  document.getElementById('done-count').innerText = doneCount;
  document.getElementById('waiting-count').innerText = waitingCount;
  document.getElementById('between-count').innerText = betweenCount;
}

window.onload = updateStatusCounts;
