// Get property list on page load
async function getPropertyList() {
  try {
      const response = await axios.get('http://localhost:3006/api/properties');
      const propertyList = document.getElementById('propertyList');

      propertyList.innerHTML = '';
      response.data.forEach(property => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `Title: ${property.title} <br> 
              Price : Rs${property.price} <br> 
              Bedrooms: ${property.bedrooms} <br> 
              Bathrooms: ${property.bathrooms} <br> 
              Square Ft: ${property.squareFt} <br> 
              <button onclick="editProperty(${property.id})">Edit</button>
              <button onclick="deleteProperty(${property.id})">Delete</button>`;
          propertyList.appendChild(listItem);
      });
  } catch (error) {
      console.error(error);
  }
}

  // Add property on form submit
  async function addProperty(event) {
    event.preventDefault();
    const addPropertyForm = event.target;
    const title = addPropertyForm.title.value;
    const price = addPropertyForm.price.value;
    const bedrooms = addPropertyForm.bedrooms.value;
    const bathrooms = addPropertyForm.bathrooms.value;
    const squareFt = addPropertyForm.squareFt.value;

    try {
        await axios.post('http://localhost:3006/api/properties', { title, price, bedrooms, bathrooms, squareFt });
        getPropertyList(); // Refresh the property list after adding
        addPropertyForm.reset(); // Clear the form
    } catch (error) {
        console.error(error);
    }
}

  // Edit user
  async function editProperty(propertyId) {
    const title = prompt('Enter new title:');
    const price = prompt('Enter new price:');
    const bedrooms = prompt('Enter new number of bedrooms:');
    const bathrooms = prompt('Enter new number of bathrooms:');
    const squareFt = prompt('Enter new square footage:');

    try {
        await axios.put(`http://localhost:3006/api/properties/${propertyId}`, { title, price, bedrooms, bathrooms, squareFt });
        getPropertyList(); // Refresh the property list after editing
    } catch (error) {
        console.error(error);
    }
}


  // Delete user
  async function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        try {
            await axios.delete(`http://localhost:3006/api/properties/${propertyId}`);
            getPropertyList(); // Refresh the property list after deleting
        } catch (error) {
            console.error(error);
        }
    }
}

document.getElementById('addPropertyForm').addEventListener('submit', addProperty);
getPropertyList(); // Initial load of user list