'use strict'
const router = require("express").Router();

let allRoutes = ({app, models})=>{

    router.post("/save", (req, res) => {

        let { Sales } = models
        let salesData = req.body
        salesData.date = new Date(salesData.date)

        // Save sales data in the database
        Sales.create(salesData)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the sales record!"
                });
            });
    })

    router.get("/fetch/:statusType", (req, res) => {

        let { Sales } = models
        let salesData = req.body
        salesData.date = new Date(salesData.date)

        // Save sales data in the database
        return Sales.findAll({raw:true})
            .then(data => {
                res.send(data);
            })
    })

    return router
}

module.exports = allRoutes