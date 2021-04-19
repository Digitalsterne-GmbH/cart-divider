const Divider = require('../src/divider.js');

const options = {
    validation: {
        keys: [
            'id',
            'price'
        ]
    },
    result : {
        returnAll : true
    }
}

const products = [
    {
        "name": "First Product",
        "id": "000000001",
        "price": 100.00,
        "brand": "Mustermann KG",
        "quantity": 2,
        "category": "PCs",
        "condition": "Gebraucht"
    },
    {
        "name": "Second Product",
        "id": "000000002",
        "price": 200.00,
        "brand": "Himmelfahrt LTD",
        "quantity": 1,
        "category": "Notebooks",
        "condition": "Gebraucht"
    },
    {
        "name": "Third Product",
        "id": "000000003",
        "price": 300.00,
        "brand": "Bürger GmbH",
        "quantity": 1,
        "category": "Monitore",
        "condition": "Neu"
    },
    {
        "name": "Fourth Product",
        "id": "000000004",
        "price": 400.00,
        "brand": "Maxi",
        "quantity": 1,
        "category": "Zubehör",
        "condition": "Gebraucht"
    }
]

const grouping = [
    {
        name: "NEU",
        scheme: {
            include: [
                {
                    operator : "AND",
                    condition : "condition",
                    expected : [
                        "Neu"
                    ]
                }
            ]
        }
    },
    {
        name: "GEB_MNP",
        scheme: {
            include: [
                {
                    operator : "AND",
                    condition : "condition",
                    expected : [
                        "Gebraucht"
                    ]
                },
                {
                    operator : "OR",
                    condition : "category",
                    expected : [
                        "Monitore",
                        "Notebooks",
                        "PCs"
                    ]
                }
            ]
        }
    },
    {
        name: "GEB",
        scheme: {
            include: [
                {
                    operator : "AND",
                    condition : "condition",
                    expected : [
                        "Gebraucht"
                    ]
                }
            ],
            exclude : [
                {
                    condition : "category",
                    expected : [
                        "Monitore",
                        "Notebooks",
                        "PCs"
                    ]
                }
            ]
        }
    }
]

let divider = new Divider(products, grouping, options);
divider.divide(function(result, processed) {
    console.log(result, processed);
});