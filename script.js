document.addEventListener('DOMContentLoaded', () => {
    const selectionContainer = document.getElementById('selection-container');
    const formContainer = document.getElementById('form-container');
    const parteElement = document.getElementById('parte');
    const exerciseForm = document.getElementById('exercise-form');
    const exercisesContainer = document.getElementById('exercises-container');
    let currentPart = '';

    document.querySelectorAll('.body-part-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const part = this.getAttribute('data-part');
            const image = this.getAttribute('data-image');
            parteElement.textContent = part.charAt(0).toUpperCase() + part.slice(1);
            currentPart = part;
            formContainer.style.backgroundImage = `url('${image}')`;
            selectionContainer.classList.add('hidden');
            formContainer.classList.remove('hidden');
            showSavedExercises(part);
        });
    });

    exerciseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const exerciseInput = document.getElementById('exercise');
        const weightInput = document.getElementById('weight');
        const weightUnit = document.getElementById('weight-unit').value;
        const repetitionsInput = document.getElementById('repetitions');

        const exercise = exerciseInput.value;
        const weight = weightInput.value + ' ' + weightUnit;
        const repetitions = repetitionsInput.value;

        saveExercise(currentPart, exercise, weight, repetitions);
        
        exerciseInput.value = '';
        weightInput.value = '';
        repetitionsInput.value = '';
        showSavedExercises(currentPart);
    });

    function saveExercise(part, exercise, weight, repetitions) {
        const exercises = JSON.parse(localStorage.getItem(part)) || [];
        exercises.push({ exercise, weight, repetitions });
        localStorage.setItem(part, JSON.stringify(exercises));
    }

    function showSavedExercises(part) {
        exercisesContainer.innerHTML = '';
        const exercises = JSON.parse(localStorage.getItem(part)) || [];
        exercises.forEach((item, index) => {
            const exerciseItem = document.createElement('div');
            exerciseItem.classList.add('exercise-item');
            exerciseItem.innerHTML = `
                <p>Ejercicio: ${item.exercise}</p>
                <p>Peso: ${item.weight}</p>
                <p>Repeticiones: ${item.repetitions}</p>
                <div class="edit-buttons">
                    <button class="edit-button" data-index="${index}">Editar</button>
                    <button class="delete-button" data-index="${index}">Eliminar</button>
                </div>
            `;
            exercisesContainer.appendChild(exerciseItem);

            exerciseItem.querySelector('.edit-button').addEventListener('click', function() {
                editExercise(part, index, item.exercise, item.weight, item.repetitions);
            });

            exerciseItem.querySelector('.delete-button').addEventListener('click', function() {
                deleteExercise(part, index);
            });
        });
    }

    function editExercise(part, index, exercise, weight, repetitions) {
        const weightValue = weight.split(' ')[0];
        const weightUnit = weight.split(' ')[1];

        document.getElementById('exercise').value = exercise;
        document.getElementById('weight').value = weightValue;
        document.getElementById('weight-unit').value = weightUnit;
        document.getElementById('repetitions').value = repetitions;

        const exercises = JSON.parse(localStorage.getItem(part));
        exercises.splice(index, 1);
        localStorage.setItem(part, JSON.stringify(exercises));
    }

    function deleteExercise(part, index) {
        const exercises = JSON.parse(localStorage.getItem(part));
        exercises.splice(index, 1);
        localStorage.setItem(part, JSON.stringify(exercises));
        showSavedExercises(part);
    }

    document.getElementById('back-button').addEventListener('click', function() {
        formContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
    });
});
