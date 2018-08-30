const express = require('express');
const router = express.Router();
const userModel = require('./users/usersModel.js');

router.get('/:id', (req, res)=>{
    let { id } = req.params;
    userModel.get(id)
        .then(data => {
            res.status(200).json({message: data})
        })
        .catch(err => {
            res.status(500).json({ message: 'Unable to grab user list.' })
        })
});

router.post('/', (req, res)=>{
    let { name } = req.params;
    userModel.insert(name)
        .then(data => {
            res.status(201).json({message: 'Made a new user.'})
        })
        .catch(err => {
            res.status(500).json({message: 'Unable to create a new user.'})
        });
});

router.put('/:id', (req, res)=>{
    let { id } = req.params;
    usersModel.udpate(id, req.params)
        .then(data => {
            res.status(200).json({message: `${data} updated.`})
        })
        .catch(err => {
            res.status(500).json({message: 'Unalbe to update user name'})
        });
});

router.delete('/:id', (req, res)=>{
    let { id } = req.params;
    usersModel.remove(id)
        .then(data => {
            res.status(204).json({message: 'User deleted.'});
        })
        .catch(err => {
            res.status(500).json({message: 'Unable to delete user.'})
        });
});

module.exports = router;