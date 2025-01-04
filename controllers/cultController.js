const CultModel = require('../models/cultModel');

exports.addCultData = async (req, res) => {
    try {
        const { date, location, service, hollyWord, preaching, amount } = req.body;

        // Garantindo que a data seja um objeto Date válido
        const parsedDate = new Date(date);
        const parsedAmount = Number(amount);

        // Verificação de campos obrigatórios
        if (!date || !location || !service || !hollyWord || !preaching || !amount) {
            throw new Error('Faltando campos obrigatórios');
        }

        // Adicionando o culto ao banco de dados (modelo)
        await CultModel.add({
            date: parsedDate,
            location,
            service,
            hollyWord,
            preaching,
            amount: parsedAmount,
        });

        // Redirecionando após adicionar
        res.redirect('/');
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).send('Error adding data: ' + error.message);
    }
};

exports.getAllCultData = async (req, res) => {
    try {
        // Obtendo todos os cultos
        const data = await CultModel.getAll();

        // Formatando as datas para exibição
        const formattedCults = data.map(cult => {
            const date = new Date(cult.get('date'));
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            cult.set('formattedDate', formattedDate);
            return cult;
        });

        // Calculando as estatísticas
        const cultCount = formattedCults.length;

        let topAttendee = { name: '', count: 0 };
        let topExhorter = { name: '', count: 0 };
        let topLocation = { location: '', count: 0 };

        const serviceCount = {};
        const preachingCount = {};
        const locationCount = {};

        // Contando as ocorrências de cada atendimento, exortação e local
        formattedCults.forEach(cult => {
            const service = cult.get('service');
            const preaching = cult.get('preaching');
            const location = cult.get('location');

            // Contando atendimentos
            serviceCount[service] = (serviceCount[service] || 0) + 1;

            // Contando exortações
            preachingCount[preaching] = (preachingCount[preaching] || 0) + 1;

            // Contando locais
            locationCount[location] = (locationCount[location] || 0) + 1;
        });

        // Encontrando o atendimento mais frequente
        for (const service in serviceCount) {
            if (serviceCount[service] > topAttendee.count) {
                topAttendee = { name: service, count: serviceCount[service] };
            }
        }

        // Encontrando a exortação mais frequente
        for (const preaching in preachingCount) {
            if (preachingCount[preaching] > topExhorter.count) {
                topExhorter = { name: preaching, count: preachingCount[preaching] };
            }
        }

        // Encontrando o local mais frequente
        for (const location in locationCount) {
            if (locationCount[location] > topLocation.count) {
                topLocation = { location, count: locationCount[location] };
            }
        }

        // Enviando os dados para a view (index.ejs)
        res.render('index', { 
            cults: formattedCults, 
            cultCount, 
            topAttendee, 
            topExhorter, 
            topLocation 
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Error fetching data: ' + error.message);
    }
};

exports.deleteCultData = async (req, res) => {
    try {
        const { id } = req.params;
        await CultModel.delete(id); // Exclui o culto pelo id
        res.redirect('/'); // Redireciona para a página inicial após a exclusão
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).send('Error deleting data: ' + error.message);
    }
};

// Função para processar a atualização
exports.updateCultData = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, location, service, hollyWord, preaching, amount } = req.body;

        // Validação dos campos
        if (!date || !location || !service || !hollyWord || !preaching || !amount) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Atualizando os dados do culto
        const updatedCult = {
            date: new Date(date),
            location,
            service,
            hollyWord,
            preaching,
            amount: Number(amount)
        };

        await CultModel.update(id, updatedCult);
        res.redirect('/');
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        res.status(500).send('Erro ao atualizar dados: ' + error.message);
    }
};

// Adicione esta nova função ao cultController.js

// Função para carregar o formulário de edição
exports.getEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const cult = await CultModel.getById(id);
        
        if (!cult) {
            return res.status(404).send('Culto não encontrado');
        }

        // Formatando a data para o formato esperado pelo input type="date"
        const date = new Date(cult.get('date'));
        const formattedDate = date.toISOString().split('T')[0];

        // Renderizando o formulário com os dados
        res.render('editCult', {
            cult: {
                id: cult.id,
                date: formattedDate,
                location: cult.get('location'),
                service: cult.get('service'),
                hollyWord: cult.get('hollyWord'),
                preaching: cult.get('preaching'),
                amount: cult.get('amount')
            }
        });
    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.status(500).send('Erro ao carregar formulário de edição: ' + error.message);
    }
};

