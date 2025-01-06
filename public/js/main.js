// main.js
import '../css/styles.css';
import '../css/filter.css';
import '../css/addForm.css';
import '../css/editForm.css';
import './filter.js';

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

// Função para rolar até o culto específico
window.scrollToCult = function(cultId) {
    const cultElement = document.querySelector(`.cult-card[data-cult-id="${cultId}"]`);
    if (cultElement) {
        // Remove highlight de qualquer card anteriormente destacado
        document.querySelectorAll('.cult-card.highlighted').forEach(card => {
            card.classList.remove('highlighted');
        });

        // Adiciona a classe para destacar o card
        cultElement.classList.add('highlighted');

        // Fecha o modal
        document.getElementById('exhortationModal').style.display = 'none';
        document.body.style.overflow = 'auto';

        // Rola até o elemento
        cultElement.scrollIntoView({ behavior: 'smooth' });
    }
};

    // Função para controlar a exibição dos modais
    window.toggleStatsModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        } else {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    // Fechar modal ao clicar fora dele
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('stats-modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = "auto";
        }
    });

    // Prevenir que cliques dentro do modal fechem ele
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    // Adicionar eventos de teclado para fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.stats-modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = "auto";
        }
    });
});