function showSpecifications() {
  const deviceCategory = document.getElementById('device-category').value;
  const specificationsDiv = document.getElementById('specifications');
  specificationsDiv.innerHTML = '';

  if (deviceCategory === 'computer') {
    specificationsDiv.innerHTML = `
        <div id="input-radio">
          <!-- Radio buttons for RAM -->
          <div class="ram">
            <h3>RAM</h3>
            <label for="ram-2gb">
              <input type="radio" name="ram" id="ram-2gb" value="2GB" /> 2GB
            </label>
            <label for="ram-4gb">
              <input type="radio" name="ram" id="ram-4gb" value="4GB" /> 4GB
            </label>
            <label for="ram-8gb">
              <input type="radio" name="ram" id="ram-8gb" value="8GB" /> 8GB
            </label>
            <label for="ram-16gb">
              <input type="radio" name="ram" id="ram-16gb" value="16GB" /> 16GB
            </label>
          </div>
  
          <!-- Radio buttons for Storage -->
          <div class="storage">
            <h3>storage</h3>
            <label for="storage-80gb">
              <input type="radio" name="storage" id="storage-80gb" value="80GB" />  80GB
            </label>
            <label for="storage-160gb">
              <input type="radio" name="storage" id="storage-160gb" value="160GB" />  160GB
            </label>
            <label for="storage-250gb">
              <input type="radio" name="storage" id="storage-250gb" value="250GB" />  250GB
            </label>
            <label for="storage-500gb">
              <input type="radio" name="storage" id="storage-500gb" value="500GB" />  500GB
            </label>
          </div>
        </div>`;
  } else if (deviceCategory === 'laptop') {
    specificationsDiv.innerHTML = `
        <div id="input-radio">
          <!-- Radio buttons for RAM -->
          <div class="ram">
            <h3>RAM</h3>
            <label for="ram-2gb">
              <input type="radio" name="ram" id="ram-2gb" value="2GB" /> 2GB
            </label>
            <label for="ram-4gb">
              <input type="radio" name="ram" id="ram-4gb" value="4GB" /> 4GB
            </label>
            <label for="ram-8gb">
              <input type="radio" name="ram" id="ram-8gb" value="8GB" /> 8GB
            </label>
            <label for="ram-16gb">
              <input type="radio" name="ram" id="ram-16gb" value="16GB" /> 16GB
            </label>
          </div>
  
          <!-- Radio buttons for Storage -->
          <div class="storage">
            <h3>storage</h3>
            <label for="storage-80gb">
              <input type="radio" name="storage" id="storage-80gb" value="80GB" />  80GB
            </label>
            <label for="storage-160gb">
              <input type="radio" name="storage" id="storage-160gb" value="160GB" />  160GB
            </label>
            <label for="storage-250gb">
              <input type="radio" name="storage" id="storage-250gb" value="250GB" />  250GB
            </label>
            <label for="storage-500gb">
              <input type="radio" name="storage" id="storage-500gb" value="500GB" />  500GB
            </label>
          </div>
          <!-- Radio buttons for Charger -->
          <div class="charger">
            <h3>Adaptor</h3>
            <label for="charger-yes">
              <input type="radio" name="charger" id="charger-yes" value="yes" /> Yes
            </label>
            <label for="charger-no">
              <input type="radio" name="charger" id="charger-no" value="no" /> No
            </label>
          </div>
        </div>`;
  } else if (deviceCategory === 'dvr') {
    specificationsDiv.innerHTML = `<div class="charger">
      <h3>Adaptor</h3>
      <label for="charger-yes">
        <input type="radio" name="charger" id="charger-yes" value="yes" /> Yes
      </label>
      <label for="charger-no">
        <input type="radio" name="charger" id="charger-no" value="no" /> No
      </label>
    </div>`;
  }
}

// Form submit handler
// Form submit handler
document
  .getElementById('form-device')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const customerName = document.getElementById('name').value;
    const deviceCategory = document.getElementById('device-category').value;
    const issue = document.querySelector('input[name="issue"]:checked').value;
    const toFix = document.getElementById('to-fix').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const specifications = {};

    // Check if device category is computer, laptop, or DVR
    if (deviceCategory === 'computer' || deviceCategory === 'laptop') {
      // Retrieve the selected RAM and Storage for computer and laptop
      specifications.ram = document.querySelector('input[name="ram"]:checked');
      specifications.storage = document.querySelector(
        'input[name="storage"]:checked'
      );

      // Additional check for laptop charger
      if (deviceCategory === 'laptop') {
        specifications.charger = document.querySelector(
          'input[name="charger"]:checked'
        );
      }

      // Check if all necessary specifications are selected
      if (
        !specifications.ram ||
        !specifications.storage ||
        (deviceCategory === 'laptop' && !specifications.charger)
      ) {
        alert('Please select all specifications before submitting.');
        return;
      }
    } else if (deviceCategory === 'dvr') {
      // DVR requires only charger
      specifications.charger = document.querySelector(
        'input[name="charger"]:checked'
      );

      // Check if charger is selected for DVR
      if (!specifications.charger) {
        alert('Please select the charger option for DVR before submitting.');
        return;
      }
    }

    // Prepare the data for submission
    const submissionData = {
      id: generateNextId(),
      customerName: document.getElementById('name').value,
      deviceCategory: document.getElementById('device-category').value,
      issue,
      toFix,
      status, // Check this is being selected correctly
      specifications: {
        ram: document.querySelector('input[name="ram"]:checked')?.value,
        storage: document.querySelector('input[name="storage"]:checked')?.value,
        charger: document.querySelector('input[name="charger"]:checked')?.value,
      },
    };

    console.log(submissionData);
    try {
      let customers = JSON.parse(localStorage.getItem('customers')) || [];
      customers.push(submissionData);
      localStorage.setItem('customers', JSON.stringify(customers));
      alert('Customer data saved locally!');
    } catch (error) {
      console.error('Error submitting device:', error);
    }
  });

function generateNextId() {
  let lastId = localStorage.getItem('lastId'); // Get the last used ID from localStorage

  if (lastId === null) {
    lastId = 0; // If no ID exists, start with 0
  } else {
    lastId = parseInt(lastId); // Parse the string to an integer
  }

  const newId = lastId + 1; // Increment the ID

  // localStorage.setItem('lastId', newId); // Save the new ID as 'lastId' in localStorage

  return newId; // Return the new incremented ID
}

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
