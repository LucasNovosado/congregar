const CultModel = require('../models/cultModel');

exports.addCultData = async (req, res) => {
    try {
        const { date, location, service, hollyWord, preaching, amount, exhortation, typeCult } = req.body;

        const parsedDate = new Date(date);
        const parsedAmount = Number(amount);

        if (!date || !location || !service || !hollyWord || !preaching || !amount || !exhortation || !typeCult) {
            throw new Error('Faltando campos obrigatórios');
        }

        await CultModel.add({
            date: parsedDate,
            location,
            service,
            hollyWord,
            preaching,
            amount: parsedAmount,
            exhortation,
            typeCult // Agora o campo será salvo corretamente
        }, req.session.user.id);

        res.redirect('/');
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).send('Error adding data: ' + error.message);
    }
};

exports.getAllCultData = async (req, res) => {
    try {
        const data = await CultModel.getAll(req.session.user.id);
        
        const formattedCults = data.map(cult => {
            const date = new Date(cult.get('date'));
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            cult.set('formattedDate', formattedDate);
            return cult;
        });

        const cultCount = formattedCults.length;

        // Contadores para estatísticas
        const serviceCount = {};
        const preachingCount = {};
        const locationCount = {};

        // Contando ocorrências
        formattedCults.forEach(cult => {
            const service = cult.get('service');
            const preaching = cult.get('preaching');
            const location = cult.get('location');

            serviceCount[service] = (serviceCount[service] || 0) + 1;
            preachingCount[preaching] = (preachingCount[preaching] || 0) + 1;
            locationCount[location] = (locationCount[location] || 0) + 1;
        });

        // Convertendo para arrays e ordenando
        const sortedServices = Object.entries(serviceCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const sortedPreaching = Object.entries(preachingCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const sortedLocations = Object.entries(locationCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Pegando os top 3 de cada categoria
        const topAttendee = sortedServices[0] || { name: '', count: 0 };
        const topExhorter = sortedPreaching[0] || { name: '', count: 0 };
        const topLocation = { 
            location: sortedLocations[0]?.name || '', 
            count: sortedLocations[0]?.count || 0 
        };

        res.render('index', { 
            cults: formattedCults, 
            cultCount,
            topAttendee,
            topExhorter,
            topLocation,
            // Enviando listas completas ordenadas
            allServices: sortedServices,
            allPreaching: sortedPreaching,
            allLocations: sortedLocations
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
        const { date, location, service, hollyWord, preaching, amount, exhortation, typeCult } = req.body;

        if (!date || !location || !service || !hollyWord || !preaching || !amount || !exhortation || !typeCult) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const updatedCult = {
            date: new Date(date),
            location,
            service,
            hollyWord,
            preaching,
            amount: Number(amount),
            exhortation,
            typeCult
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

        const date = new Date(cult.get('date'));
        const formattedDate = date.toISOString().split('T')[0];

        res.render('editCult', {
            cult: {
                id: cult.id,
                date: formattedDate,
                location: cult.get('location'),
                service: cult.get('service'),
                hollyWord: cult.get('hollyWord'),
                preaching: cult.get('preaching'),
                amount: cult.get('amount'),
                exhortation: cult.get('exhortation'),
                typeCult: cult.get('typeCult') // Adicionando o tipo do culto
            }
        });
    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.status(500).send('Erro ao carregar formulário de edição: ' + error.message);
    }
};

