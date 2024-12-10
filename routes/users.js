import express from 'express';
import AWS from 'aws-sdk';
import { authenticateToken } from '../app.js';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();
AWS.config.update({
    region: 'sa-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

router.get('/', authenticateToken, (req, res) => {
    const userData = {
        email: req.user.email,
        name: req.user.name
    };
    res.render('userpage/user', { user: userData });
});

router.get('/schedule', authenticateToken, async (req, res) => {
    try {
        const params = {
            TableName: 'WorkSchedules',
            Key: {
                email: req.user.email
            },
        };
        const result = await dynamoDB.get(params).promise();
        const workSchedule = result.Item ? result.Item.workDays : [];
        const userData = {
            email: req.user.email,
            name: req.user.name
        };
        res.render('userpage/schedule', { workSchedule, user: userData });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).send('Error fetching work schedule');
    }
});

router.post('/schedule', authenticateToken, async (req, res) => {
    try {
        const schedule = req.body.schedule; // Obtenha o schedule do formulário
        const workDays = Object.keys(schedule).map(day => ({
            day: day,
            start: schedule[day].start,
            end: schedule[day].end
        }));

        const params = {
            TableName: 'WorkSchedules',
            Item: {
                email: req.user.email,
                workDays: workDays,
                createdAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();
        res.redirect('/user/schedule');
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).send('Error saving work schedule');
    }
});

// Rota GET para buscar os serviços do usuário
router.get('/services', authenticateToken, async (req, res) => {

    try {
        const params = {
            TableName: 'UserServices',
            Key: {
                email: req.user.email,
            }
        };
  
        const result = await dynamoDB.get(params).promise();
        const userServices = result.Item ? result.Item.services : [];
        const userData = {
            email: req.user.email,
            name: req.user.name
        };
        res.render('userpage/services', { userServices, user: userData });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Could not fetch services' });
    }
});
  
  // Rota POST para adicionar ou atualizar os serviços do usuário
  router.post('/services', authenticateToken, async (req, res) => {
    const { userServices } = req.body; // List of services provided by the user

    if (!Array.isArray(userServices)) {
        return res.status(400).json({ error: 'Invalid services format. Must be an array.' });
    }

    try {
        const params = {
            TableName: 'UserServices',
            Key: {
                email: req.user.email
            },
            UpdateExpression: 'SET #services = list_append(if_not_exists(#services, :empty_list), :new_services)',
            ExpressionAttributeNames: {
                '#services': 'services'
            },
            ExpressionAttributeValues: {
                ':new_services': userServices,
                ':empty_list': []
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDB.update(params).promise();
        console.log('Updated services:', result.Attributes);
        res.redirect('/user/services');
    } catch (error) {
        console.error('Error saving services:', error);
        res.status(500).json({ error: 'Could not save services' });
    }
});

// Rota POST para deletar um serviço específico
router.post('/services/delete', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { serviceName } = req.body; 

    try {
        
        const getParams = {
            TableName: 'UserServices',
            Key: { email }
        };

        const data = await dynamoDB.get(getParams).promise();

        if (!data.Item || !Array.isArray(data.Item.services)) {
            // Sem serviços para deletar
            return res.redirect('/user/services');
        }

        // Filtra o serviço a deletar
        const updatedServices = data.Item.services.filter(service => service.name !== serviceName);

        const updateParams = {
            TableName: 'UserServices',
            Key: { email },
            UpdateExpression: 'SET #services = :updatedServices',
            ExpressionAttributeNames: {
                '#services': 'services'
            },
            ExpressionAttributeValues: {
                ':updatedServices': updatedServices
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDB.update(updateParams).promise();
        //console.log('Updated services after deletion:', result.Attributes);
        res.redirect('/user/services');
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).send('Could not delete service');
    }
});
  

export default router;