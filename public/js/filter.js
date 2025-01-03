document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filterButton');
    const resetButton = document.getElementById('resetFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    // Função para atualizar card de estatística
    function updateStatCard(selector, text, count = 0) {
        const card = document.querySelector(selector);
        if (!card) return;

        // Se não houver contagem, mostrar '--'
        const displayText = count > 0 ? `${text}: ${count}x` : '--';
        
        // Adicionar classe para animação
        card.classList.add('updating');
        card.textContent = displayText;
        
        // Remover classe após animação
        setTimeout(() => {
            card.classList.remove('updating');
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

        // Atualizar cards de estatísticas
        const cultStats = document.querySelector('.stat-card:nth-child(1) p');
        const serviceStats = document.querySelector('.stat-card:nth-child(2) p');
        const preachingStats = document.querySelector('.stat-card:nth-child(3) p');
        const locationStats = document.querySelector('.stat-card:nth-child(4) p');

        if (hasVisibleCards) {
            // Encontrar mais frequentes
            const topService = Object.entries(stats.services)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);
            const topPreaching = Object.entries(stats.preachings)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);
            const topLocation = Object.entries(stats.locations)
                .reduce((a, b) => b[1] > a[1] ? b : a, ['--', 0]);

            // Atualizar estatísticas
            cultStats.textContent = `Congregou: ${stats.cultCount}x`;
            serviceStats.textContent = `${topService[0]}: ${topService[1]}x`;
            preachingStats.textContent = `${topPreaching[0]}: ${topPreaching[1]}x`;
            locationStats.textContent = `${topLocation[0]}: ${topLocation[1]}x`;
        } else {
            // Caso não encontre resultados
            cultStats.textContent = '--';
            serviceStats.textContent = '--';
            preachingStats.textContent = '--';
            locationStats.textContent = '--';
        }

        // Adicionar efeito visual aos cards de estatísticas
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.add('filtered');
            setTimeout(() => card.classList.remove('filtered'), 500);
        });

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
    filterButton.addEventListener('click', filterCults);
    resetButton.addEventListener('click', resetFilters);

    // Filtrar ao pressionar Enter
    [startDate, endDate].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterCults();
            }
        });
    });
});
