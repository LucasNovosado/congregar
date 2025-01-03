const Parse = require('parse/node');

Parse.initialize("1i7IOgY4ars5vkNbUf94hGDwMSbNdhA5NEZhBHgZ", "mYNu079k0YtVaL0uporYGHPonJdGMm1pYHt3KkYY");
Parse.serverURL = "https://parseapi.back4app.com";

const Cult = Parse.Object.extend('Cult');

exports.getAll = async () => {
    try {
        const query = new Parse.Query(Cult);
        return await query.find();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error('Error fetching data');
    }
};

exports.add = async (data) => {
    try {
        // Log para verificação dos dados que estão sendo recebidos
        console.log("Dados recebidos para adicionar culto:", data);

        // Verificação se todos os campos obrigatórios estão presentes
        if (!data.date || !data.location || !data.service || !data.hollyWord || !data.preaching || !data.amount) {
            throw new Error("Missing required fields");
        }

        const cult = new Cult();
        return await cult.save(data);
    } catch (error) {
        // Log do erro
        console.error("Error adding data:", error);
        throw new Error('Error adding data');
    }
};


exports.delete = async (id) => {
    try {
        const query = new Parse.Query(Cult);
        const cult = await query.get(id);
        return await cult.destroy();
    } catch (error) {
        console.error("Error deleting data:", error);
        throw new Error('Error deleting data');
    }
};

exports.update = async (id, data) => {
    try {
        const query = new Parse.Query(Cult);
        const cult = await query.get(id);

        // Verificação se há algum campo para atualizar
        if (!data.date && !data.location && !data.service && !data.hollyWord && !data.preaching && !data.amount) {
            throw new Error('No valid fields to update');
        }

        return await cult.save(data);
    } catch (error) {
        console.error("Error updating data:", error);
        throw new Error('Error updating data');
    }
};

// Adicione este método ao cultModel.js

exports.getById = async (id) => {
    try {
        const query = new Parse.Query(Cult);
        return await query.get(id);
    } catch (error) {
        console.error("Erro ao buscar culto:", error);
        throw new Error('Erro ao buscar culto');
    }
};
