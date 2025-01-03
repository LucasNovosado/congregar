// main.js
import '../css/styles.css';
import '../css/filter.css';
import '../css/addForm.css';
import '../css/editForm.css';
import './filter.js';  // Adicione esta linha

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission for adding a new cult
    const addCultForm = document.getElementById('add-cult-form');
    if (addCultForm) {
        addCultForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(addCultForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Cult added successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to add cult.');
                }
            } catch (error) {
                console.error('Error adding cult:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Handle delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id;

            try {
                const response = await fetch(`/delete/${id}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    alert('Cult deleted successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to delete cult.');
                }
            } catch (error) {
                console.error('Error deleting cult:', error);
                alert('An error occurred. Please try again.');
            }
        });
    });
});
