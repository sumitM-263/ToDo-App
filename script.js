document.addEventListener('DOMContentLoaded', function (){

    
    const toDoInput = document.getElementById('todo-input')
    const addTaskButton = document.getElementById('add-todo-btn')
    const toDoList = document.getElementById('todo-list')
    const toDoFilters = document.querySelector('.todo-filters')
    const clearCompletedBtn = document.getElementById('clear-completed-btn')
    const toDoCount = document.getElementById('todo-count')
    

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    let activeToDos = 0

    tasks.forEach(task => renderTask(task))

    saveTasks()
    // console.log(tasks)


    addTaskButton.addEventListener('click', function (){
        
        addTask()
        
    })


    toDoFilters.addEventListener('click', (e)=>{
        
        toDoFilters.querySelectorAll('.filter-btn').forEach(el =>{
            el.classList.remove('active')
        })

        e.target.classList.add('active')

        const taskStatus = e.target.dataset.filter

        toDoList.innerHTML = ''

        let filteredTasks;

        if(taskStatus !== 'all') {
            filteredTasks = tasks.filter(task => task.status === taskStatus)
            filteredTasks.forEach(task => renderTask(task))
            document.querySelector('.todo-stats').style.display = 'none'
        }
        else{
            tasks.forEach(task => renderTask(task))
            document.querySelector('.todo-stats').style.display = 'flex'
        }
        

    })
    

    clearCompletedBtn.addEventListener('click', function (){
        toDoList.innerHTML = ''
        tasks = tasks.filter(task => task.status !== 'completed')
        tasks.forEach(task => renderTask(task))
        // console.log(tasks)
        saveTasks()
    })

    

    function addTask(){
        const taskName = toDoInput.value.trim()
        if(taskName === "") return

        const newTask = {
            id: Date.now(),
            text: taskName,
            status: 'active'
        }

        tasks.push(newTask)
        renderTask(newTask)
        saveTasks()
        toDoInput.value = ''
        
    }


    function renderTask(task){
        const li = document.createElement('li')
        li.classList.add('todo-item')
        li.innerHTML = `
        
        <input type="checkbox" name="checkbox" id="todo-checkbox-${task.id}" class = "todo-checkbox">
        <span class = "todo-text" id="${task.id}">${task.text}</span>
        <div class = 'todo-actions'>
        <button class = "edit-btn">edit</button>
        <button class = "delete-todo-btn">delete</button>
        </div>
        `


        toDoList.appendChild(li)

        if(task.status === 'completed'){
            li.querySelector(`#todo-checkbox-${task.id}`).setAttribute('checked', null)
            li.querySelector('.todo-text').classList.add('completed')
            li.querySelector('.todo-text').classList.remove('active')
            activeToDos--
        }

        const checkBox = li.querySelector('.todo-checkbox')
        checkBox.addEventListener('change', function (){
                checkBox.toggleAttribute('checked')

                if(checkBox.hasAttribute('checked')){
                    li.querySelector('.todo-text').classList.add('completed')
                    li.querySelector('.todo-text').classList.remove('active')

                    task.status = 'completed'
                    
                    
                }
                else{
                    li.querySelector('.todo-text').classList.remove('completed')
                    task.status = 'active'
                    
                }
                // console.log(task)
                
                saveTasks()
            })
        

        li.querySelector('.delete-todo-btn').addEventListener('click', function (){
            li.remove()
            tasks = tasks.filter(t => t.id !== task.id)
            saveTasks()
            
        } )

        const taskText = document.getElementById(`${task.id}`)
        taskText.addEventListener('click', function (){
            taskText.innerHTML = `
            <input type="text" class="todo-edit" id="todo-edit">
            `
            const input = document.getElementById('todo-edit')

        })

    }

    function updateCount(){

    }


    function saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }


})