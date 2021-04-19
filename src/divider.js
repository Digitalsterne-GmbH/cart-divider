class Divider {
    constructor(products, grouping, options) {
        this.options = {
            validation : {
                validate : true,
                keys : [
                    'id',
                    'price'
                ]
            },
            result : {
                returnAll : false   // Set true if all defined schemes should be returned
            }
        }
        if(options)
            this.options = update(this.options, options);
        this.products = this.validateProducts(products) || new Error('Validation: You must provide a valid product array according to Googles documentation or update your validation options.');
        this.groups = grouping || new Error('Validation: You must provide a valid grouping scheme.');
        this.result = {
            default : 0
        };
        this.processed = {};
    }

    /**
     * Validation of the product array according to Google Documentation and/or validation provided in options
     * @param  products     Product array according to ecommerce documentation
     * https://developers.google.com/tag-manager/devguide
     * https://developers.google.com/analytics/devguides/collection/gtagjs/ecommerce
     */
    validateProducts(products) {
        const validation = this.options.validation;
        let valid = true;
        if(validation.validate) {
            if(validation.keys.length === 0)
                return new Error('Validation: No validation keys provided in options.');
            products.forEach((product) => {
                validation.keys.forEach((key) => {
                    if (!(key in product)) {
                        valid = false;
                    }
                });
            });
        }
        if(valid)
            return products;
        else
            return false;
    }

    /**
     * Start the process and divide cart into comission groups
     */
    divide = function(callback = false) {
        let self = this;
        /**
         * Single product
         */
        self.products.forEach((product) => {
            let fitted = false;
            /**
             * Single group scheme
             */
            self.groups.forEach((group) => {
                if(self.processed[product.id] !== undefined)
                    new Error('Conflicting schemes: Product ' + product + ' matches multiple schemes: ' + self.processed[product.id]);
                /**
                 * Test product against scheme
                 */
                if(self.test(product, group.scheme) && !fitted) {
                    /**
                     * Push key to result object if undefined
                     */
                    if(self.result[group.name] === undefined)
                        self.result[group.name] = 0;
                    /**
                     * Add price value to comission group in result object
                     * @type {number}
                     */
                    if(product.quantity !== undefined)
                        self.result[group.name] += (parseInt(product.quantity) * parseFloat(product.price).toFixed(2));
                    else
                        self.result[group.name] += parseFloat(product.price).toFixed(2);
                    /**
                     * Set fitted to true
                     * @type {boolean}
                     */
                    fitted = true;
                    if(self.processed[product.id] === undefined)
                        self.processed[product.id] = [];
                    self.processed[product.id].push(group.name);
                } else if(self.options.result.returnAll){
                    if(self.result[group.name] === undefined)
                        self.result[group.name] = 0;
                }
            });
            if(!fitted){
                if(product.quantity !== undefined)
                    this.result.default += (parseInt(product.quantity) * parseFloat(product.price).toFixed(2));
                else
                    this.result.default += parseFloat(product.price).toFixed(2);
            }
        });
        if (!callback)
            return [this.result, this.processed];
        else
            return callback(this.result, this.processed);
    }

    /**
     * Test product against scheme
     * @param product
     * @param scheme
     * @returns {boolean}
     */
    test = function(product, scheme){
        const include = scheme.include;
        const exclude = scheme.exclude;
        let isFitting = true;

        if(exclude !== undefined) {

            exclude.forEach((condition) => {

                let co = condition.condition;
                let va = condition.expected;

                if (!(co in product))
                    new Error('Validation: Product ' + product + ' is missing key' + condition);
                else
                    va.forEach((value) => {
                        if (product[co] === value)
                            isFitting = false;
                    });
            });

            if (!isFitting)
                return isFitting;

        }

        if(include !== undefined) {

            include.forEach((condition) => {

                let op = condition.operator;
                let co = condition.condition;
                let va = condition.expected;

                if(!(co in product))
                    new Error('Validation: Product ' + product + ' is missing key' + condition);
                else
                    switch(op) {
                        case "AND" :
                            va.forEach((value) => {
                                if(product[co] !== value) {
                                    isFitting = false;
                                }
                                console.log('AND: ', product.id, product[co], value, (product[co] !== value), isFitting);
                            });
                            break;
                        case "OR" :
                            isFitting = false;
                            va.forEach((value) =>{
                                if(product[co] === value) {
                                    isFitting = true;
                                }
                                console.log('OR: ', product.id, product[co], value, (product[co] === value), isFitting);
                            });
                            break;
                        default:
                            new Error('Scheme error: No operator provided.');
                    }
            });

        }

        if(exclude === undefined && include === undefined){
            new Error('Scheme error: You have to define a scheme with parameters "include" and/or "exclude".');
        }

        return isFitting;
    }
}

/**
 * Merge two objects into one object
 * @param obj
 * @returns {*}
 */
function update(obj/*, …*/) {
    for (var i=1; i<arguments.length; i++) {
        for (var prop in arguments[i]) {
            var val = arguments[i][prop];
            if (typeof val == "object") // this also applies to arrays or null!
                update(obj[prop], val);
            else
                obj[prop] = val;
        }
    }
    return obj;
}

module.exports = Divider;