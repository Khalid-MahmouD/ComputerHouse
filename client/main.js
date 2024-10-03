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
            <h3>Storage</h3>
            <label for="storage-80gb">
              <input type="radio" name="storage" id="storage-80gb" value="80GB" />80GB
            </label>
            <label for="storage-128gb">
              <input type="radio" name="storage" id="storage-128gb" value="128GB" />128GB
            </label>
            <label for="storage-240gb">
              <input type="radio" name="storage" id="storage-240gb" value="240GB" />240GB
            </label>
            <label for="storage-500gb">
              <input type="radio" name="storage" id="storage-500gb" value="500GB" />500GB
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
            <h3>Storage</h3>
            <label for="storage-80gb">
              <input type="radio" name="storage" id="storage-80gb" value="80GB" />80GB
            </label>
            <label for="storage-128gb">
              <input type="radio" name="storage" id="storage-128gb" value="128GB" />128GB
            </label>
            <label for="storage-240gb">
              <input type="radio" name="storage" id="storage-240gb" value="240GB" />240GB
            </label>
            <label for="storage-500gb">
              <input type="radio" name="storage" id="storage-500gb" value="500GB" />500GB
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
      customerName: document.getElementById('name').value,
      deviceCategory: document.getElementById('device-category').value,
      issue: document.querySelector('input[name="issue"]:checked')?.value,
      toFix: document.getElementById('to-fix').value, // Ensure this field exists
      status: document.querySelector('input[name="status"]:checked').value, // Check this is being selected correctly
      specifications: {
        ram: document.querySelector('input[name="ram"]:checked')?.value,
        storage: document.querySelector('input[name="storage"]:checked')?.value,
        charger: document.querySelector('input[name="charger"]:checked')?.value,
      },
    };

    console.log(submissionData);
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Device submitted successfully!');
        console.log(data);
      } else {
        console.error('Error submitting device');
      }
    } catch (error) {
      console.error('Error submitting device:', error);
    }
  });

async function updateStatusCounts() {
  try {
    const response = await fetch('http://localhost:5000/status-count');
    const data = await response.json();
    // Update the HTML with the counts
    document.getElementById('done-count').innerText = data.done;
    document.getElementById('waiting-count').innerText = data.waiting;
    document.getElementById('between-count').innerText = data.between;
  } catch (error) {
    console.error('Error fetching status counts:', error);
  }
}

window.onload = updateStatusCounts;
