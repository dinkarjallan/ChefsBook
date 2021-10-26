// adding and removing ingredient boxes
let wrapper1 = document.getElementById('ingred-wrapper');
const addIngred = () => {
    let count = wrapper1.childElementCount;
    let input = document.createElement('input')
    input.type = 'text';
    input.name = `ingredients[${count}]`;
    input.placeholder = 'Add Ingredient...';
    wrapper1.appendChild(input); // creating new element with dynamic attributes and appending to parent
}
const removeLastIngred = () => {
    if (wrapper1.childElementCount > 1) {
        wrapper1.removeChild(wrapper1.lastChild);
        counter--;
    }
}

// adding and removing step boxes
let wrapper2 = document.getElementById('step-wrapper');
const addStep = () => {
    let step = wrapper2.childElementCount;
    let input = document.createElement('input')
    input.type = 'text';
    input.name = `steps[${step}]`;
    input.placeholder = `Step-${step + 1}`;
    wrapper2.appendChild(input); // creating new element with dynamic attributes and appending to parent
}
const removeLastStep = () => {
    if (wrapper2.childElementCount > 1) {
        wrapper2.removeChild(wrapper2.lastChild);
        step--;
    }
}