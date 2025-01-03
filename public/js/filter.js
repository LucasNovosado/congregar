document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filterButton');
    const resetButton = document.getElementById('resetFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // Função para atualizar card de estatística
    function updateStatCard(cardIndex, icon, title, text, count = 0) {
        const statisticsCards = document.querySelector('.statistics-cards');
        if (!statisticsCards) {
            console.log('Container de estatísticas não encontrado');
            return;
        }

        const card = statisticsCards.children[cardIndex - 1];
        if (!card) {
            console.log('Card não encontrado:', cardIndex);
            return;
        }

        // Atualizar o conteúdo do card
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        
        if (!h3 || !p) {
            console.log('Elementos não encontrados no card:', cardIndex);
            return;
        }

        h3.innerHTML = `<i class="fas fa-${icon}"></i> ${title}`;
        
        // Se não houver contagem ou text for '--', mostrar apenas '--'
        if (count === 0 || text === '--') {
            p.textContent = '--';
        } else {
            p.textContent = `${text}: ${count}x`;
        }
        
        // Adicionar classe para animação
        card.classList.add('filtered');
        setTimeout(() => {
            card.classList.remove('filtered');
        }, 500);
    }

    function filterCults() {
        if (!startDate.value || !endDate.value) {
            alert('Por favor, selecione ambas as datas para filtrar.');
            return;
        }

        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59);

        if (start > end) {
            alert('A data inicial não pode ser maior que a data final.');
            return;
        }

        // Estatísticas
        let stats = {
            cultCount: 0,
            services: {},
            preachings: {},
            locations: {}
        };

        // Filtrar cultos
        const cards = document.querySelectorAll('.cult-card');
        let hasVisibleCards = false;

        cards.forEach(card => {
            const dateText = card.querySelector('p:nth-child(2)').textContent.split(':')[1].trim();
            const [day, month, year] = dateText.split('/');
            const cultDate = new Date(year, month - 1, day);

            if (cultDate >= start && cultDate <= end) {
                card.style.display = 'block';
                card.style.opacity = '1';
                hasVisibleCards = true;

                // Atualizar estatísticas
                stats.cultCount++;

                // Coletar dados
                const service = card.querySelector('p:nth-child(4)').textContent.split(':')[1].trim();
                const preaching = card.querySelector('p:nth-child(6)').textContent.split(':')[1].trim();
                const location = card.querySelector('p:nth-child(3)').textContent.split(':')[1].trim();

                stats.services[service] = (stats.services[service] || 0) + 1;
                stats.preachings[preaching] = (stats.preachings[preaching] || 0) + 1;
                stats.locations[location] = (stats.locations[location] || 0) + 1;
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        if (hasVisibleCards) {
            // Encontrar mais frequentes
            const topService = Object.entries(stats.services)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);
            const topPreaching = Object.entries(stats.preachings)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);
            const topLocation = Object.entries(stats.locations)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);

            // Atualizar cards com ícones e títulos corretos
            updateStatCard(1, 'fire', 'Cultos', 'Congregou', stats.cultCount);
            updateStatCard(2, 'handshake', 'Atendimentos', topService[0], topService[1]);
            updateStatCard(3, 'book-open', 'Exortação', topPreaching[0], topPreaching[1]);
            updateStatCard(4, 'home', 'Casa de Oração', topLocation[0], topLocation[1]);
        } else {
            // Caso não encontre resultados, mostrar '--' em todos os cards com seus respectivos títulos e ícones
            updateStatCard(1, 'fire', 'Cultos', '--', 0);
            updateStatCard(2, 'handshake', 'Atendimentos', '--', 0);
            updateStatCard(3, 'book-open', 'Exortação', '--', 0);
            updateStatCard(4, 'home', 'Casa de Oração', '--', 0);
        }

        if (!hasVisibleCards) {
            alert('Nenhum culto encontrado no período selecionado.');
        }
    }

    function resetFilters() {
        startDate.value = '';
        endDate.value = '';
        
        // Restaurar visualização dos cards
        document.querySelectorAll('.cult-card').forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
        });

        // Recarregar página para restaurar estatísticas originais
        window.location.reload();
    }

    // Event Listeners
    if (filterButton) {
        filterButton.addEventListener('click', filterCults);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    // Filtrar ao pressionar Enter
    [startDate, endDate].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filterCults();
                }
            });
        }
    });
});