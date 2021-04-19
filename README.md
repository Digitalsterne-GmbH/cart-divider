# Digitalsterne Cart Divider

This library provides a basic functionality to group your products after purchase into comission groups which can be sent as parameters to different networks.

## Usage

You can initialize a new Divider class by calling

<code>
    let divider = new Divider(*products|ARRAY*, *schemes|ARRAY*, *options|OBJECT*);
</code>

### Params

You can provide multiple parameters when initializing a new instance:

Options:
<pre>
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
</pre>
<br>
Group schemes:
<pre>
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
</pre>
<br>
Products:
<pre>
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
</pre>

The products array must reference the specifications mentioned in the official Google documentation:
<br><br>
<a href="https://developers.google.com/analytics/devguides/collection/gtagjs/ecommerce">Official Google Documentation</a>

### Example

#### Without callback function

<pre>
    let divider = new Divider(products, grouping, options);
    var result = divider.divide();
</pre>

#### With callback function

<pre>
    let divider = new Divider(products, grouping, options);
    divider.divide(function(result, processed) {
        console.log(result, processed);
    });
</pre>

### Returned result

The Divider will return two variables:

[1] OBJECT holding all comission groups and the calculated values<br>
[2] OBJECT holding all product ids and their respective comission group