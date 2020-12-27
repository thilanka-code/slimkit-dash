import { writable } from "svelte/store";

export const validity = writable({});
export const formValidity = writable({});

/**
 * 
 * @param {*} formId Unique ID for the form
 * @param {*} formFields Fields Warpped in an object. 
 * {
        title: {value: 'abcd', validation: { minLength: 3, maxLength: 5 }, validationMessage: 'Value must be between 3 and 5'},
        username: {value: 'th', validation: { maxLength: 2} },
 }
 */
export function Form(formId, formFields) {

    formValidity.update(store => {
        store[formId] = { fields: {}, isValid: false, isDirty: false };

        return store;
    });

    this.formId = formId;
    this.fields = new Map;

    for (let [key, fld] of Object.entries(formFields)) {
        fld = { ...fld, fieldId: key, form: formId }
        this[fld.fieldId] = fld;
        this.fields.set(fld.fieldId, fld);
    }

    this.isValid = () => Array.from(this.fields.values())
        .filter(v => typeof v.isValid !== 'undefined' && !v.isValid).length < 1;

}

/**
* Action that will handle validation of a field
*/
export function validation(node, formField) {

    let initialValid = validateField(formField.value, formField.validation);
    formField['isValid'] = initialValid;
    formField['isDirty'] = false;
    formField['showError'] = false;

    formValidity.update(store => {
        
        store[formField.form]['fields'][formField.fieldId] = { isValid: initialValid, isDirty: false, showError: false };
        // Update the validity of whole form
        let isFormValid = true;
        for (const [key, field] of Object.entries(store[formField.form]['fields'])) {
            if (!field.isValid) {
                isFormValid = false;
                break;
            }
        }
        store[formField.form].isValid = isFormValid;

        return store;
    })

    function textFieldListener(event) {
        let newVal = validateField(event.target.value, formField.validation);

        formField['isValid'] = newVal;
        formField['isDirty'] = true;
        formField['showError'] = !newVal;
        
        formValidity.update(store => {

            store[formField.form]['fields'][formField.fieldId] = { isValid: newVal, isDirty: true, showError: !newVal };
            // Update the validity of whole form
            let isFormValid = true;
            for (const [key, field] of Object.entries(store[formField.form]['fields'])) {
                if (!field.isValid) {
                    isFormValid = false;
                    break;
                }
            }

            store[formField.form].isValid = isFormValid;
            store[formField.form].isDirty = true;
            return store;
        })
    }

    node.addEventListener("input", textFieldListener);

    return {
        destroy() {
            //Remove event listener
            node.removeEventListener("input", textFieldListener);
        }
    };
}

/**
 * Action that will perform dynaimc validation on a field
 * @param  value is text value from input
 * @param  rules validation Eg: { minLength: 3, maxLength: 5 }
 */
function validateField(value, rules) {
    
    if(typeof rules === 'string' || rules instanceof String) {
        
    }
    for (let rule of Object.entries(rules)) {
        if (!ruleChecker(value, rule)) {
            return false;
        }
    }
    return true;
}

/**
 * @deprecated
 * This method is used perform the validation upon submitting!
 * 
 * @param obj is shape of {username: {value: 'Thianka'}}
 * @param rules is an object:
 *      {
 *          "email": {length?, email?, notEmpty?, minLength?, maxLength?} },
 *          "username": {minLength: 3}
 *      }
 * 
 */
export function validate(obj, rules) {
    const errors = {};
    for (const field in rules) {
        if (obj.hasOwnProperty(field)) {
            let fieldRules = rules[field]; // {length?, email?, notEmpty?, minLength?, maxLength?} },

            Object.entries(fieldRules).forEach(e => {
                if (!ruleChecker(obj[field].value, e)) { // A rule failed on that field
                    errors[field] = errors[field] ? errors[field] : [];
                    console.log('push...');
                    console.log(e[0]);

                    errors[field].push(e[0]);
                }
            })

        } else {
            console.warn(`No '${field}' in form`);
        }

    }
    console.log('errors');
    console.log(errors);

}

/**
 * @TODO Conditional validation not supported! Eg: Only validate if field is not empty
 * @param {*} value User entered value
 * @param {*} rule Eg: { minLength: 3
 */
function ruleChecker(value, rule) {
    const [ruleType, ruleValue] = rule;

    if (ruleType === 'email') {
        return value 
            && value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    } else if (ruleType === "minLength") {
        return value && value.length >= ruleValue;
    } else if (ruleType === "maxLength") {
        return value.length <= ruleValue;
    } else if (ruleType === "length") {
        return value && value.length === ruleValue;
    } else {
        console.error(`Unknown validator type '${ruleType}'`);
        return true;
    }
}