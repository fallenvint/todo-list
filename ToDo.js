const todolist = document.querySelector('ul.list-items');
const todolistHeader = document.querySelector('div.todolist-header');
const taskCounter = todolistHeader.querySelector('.task-count');
const addBtn = document.getElementById("add_btn");
const taskInput = document.getElementById("task");
let date = new Date();
let weekday = date.getDay();
let month = date.getMonth();
let year = date.getFullYear();
let day = String(date.getDate()).padStart(2, '0'); // Day format - XX (Example: 01)
let today = `${day}/${String(month+1).padStart(2, '0')}/${year}`;
let taskArray = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];


// Get date value
const getDate = (month, weekday, day) => {
	const todayDateBlock = document.getElementsByClassName('today_date');
	const todayWeekdayBlock = document.getElementsByClassName('today_week');
	const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

	todayDateBlock[0].innerHTML = `${months[month]} ${day}, ${year}`;
	todayWeekdayBlock[0].textContent = weekdays[weekday];
}
getDate(month, weekday, day);


// Get number of tasks
const countTasks = () => {
	let tasksNumber = taskArray.length;

	switch (true) {
		case !tasksNumber:
			taskCounter.textContent = 'Нет задач';
			break;
		case (tasksNumber !== 11 && tasksNumber%10 === 1):
			taskCounter.textContent = `${tasksNumber} Задачa`;
			break;
		case (tasksNumber !== 12 && tasksNumber%10 === 2):
		case (tasksNumber !== 13 && tasksNumber%10 === 3):
		case (tasksNumber !== 14 && tasksNumber%10 === 4):
			taskCounter.textContent = `${tasksNumber} Задачи`;
			break;
		default:
			taskCounter.textContent = `${tasksNumber} Задач`;
			break;
	}
}
countTasks();


// Open and close add task panel
todolistHeader.addEventListener('click', (e) => {
	// Open input block
	if (e.target.classList.contains('add-input_open')) {
		e.target.closest('.todolist-header').classList.add('show_add-input');
	}

	// Close input block
	if (e.target.classList.contains('add-input_close')) {
		e.target.closest('.todolist-header').classList.remove('show_add-input');
		taskInput.value = '';
	}
}, false);


// Add task to list
localStorage.setItem('tasks', JSON.stringify(taskArray));
const data = JSON.parse(localStorage.getItem('tasks'));

function Task(description, date, status) {
	this.description = description;
	this.date = date;
	this.status = status;
}

const addTaskToList = (task, date, checked) => {
	const li = document.createElement("li");

	li.className = `list-item flex ${checked}`;
	li.innerHTML = `<i class="fas fa-check task-check"></i>
	<span class="task-info flex_order">${task}</span>
	<span class="task-date">${date}</span>
	<i class="fas fa-trash-alt task-delete"></i>`;
	todolist.appendChild(li);
}

addBtn.addEventListener('click', () => {
	if (taskInput.value === '' || taskInput.value === null ) {
		alert('Поле не заполнено, добавьте задачу!');
	} else {
		let compare = false;

		taskArray.forEach((element, index) => {
			if (taskInput.value.toLowerCase().localeCompare(taskArray[index].description.toLowerCase()) === 0) {
				compare = true;
			}
		});

		if (compare) {
			alert('Такая задача уже есть в списке!');
		} else {
			let first = new Task(taskInput.value, today, '');

			taskArray.push(first);
			localStorage.setItem('tasks', JSON.stringify(taskArray));
			addTaskToList(taskInput.value, today, '');
			taskInput.value = '';
			countTasks();
		}
	}
}, false);

data.forEach(item => {
	addTaskToList(item.description, item.date, item.status);
});


// Remove task from list
todolist.addEventListener('click', (e) => {
	const taskContainer = e.target.closest('li');
	const taskId = Array.prototype.indexOf.call(todolist.children, taskContainer);

	// Delete task
	if (e.target.classList.contains('task-delete')) {
		taskArray.splice(taskId, 1);
		localStorage.setItem('tasks', JSON.stringify(taskArray));
		taskContainer.remove();
		countTasks();
	}

	// Mark completed task
	if (e.target.classList.contains('task-check')) {
		if (taskArray[taskId].status === '') {
			taskArray[taskId].status = 'checked';
		} else {
			taskArray[taskId].status = '';
		}

		localStorage.setItem('tasks', JSON.stringify(taskArray));
		taskContainer.classList.toggle('checked');
	}
}, false);