document.addEventListener('DOMContentLoaded', function (){

    
    const toDoInput = document.getElementById('todo-input')
    const addTaskButton = document.getElementById('add-todo-btn')
    const toDoList = document.getElementById('todo-list')
    const toDoFilters = document.querySelector('.todo-filters')
    const clearCompletedBtn = document.getElementById('clear-completed-btn')
    const toDoCount = document.getElementById('todo-count')
    

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    

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
                updateCount()
            })
        

        li.querySelector('.delete-todo-btn').addEventListener('click', function (){
            li.remove()
            tasks = tasks.filter(t => t.id !== task.id)
            saveTasks()
            updateCount()
            
        } )

        li.querySelector('.edit-btn').addEventListener('click', function (){
            editTask(task,li)
        })

    
        updateCount()

    }

    function updateCount(){
        let activeToDos = 0

        tasks.forEach(task => {
            if(task.status === 'active') activeToDos++
        })

        toDoCount.textContent = activeToDos
    }


    function saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function editTask(task,listItem){
        
        const textSpan = listItem.querySelector('.todo-text')
        const currentText = task.text

        const editInput = document.createElement('input')
        editInput.className = 'todo-edit-input'
        editInput.type = 'text'
        editInput.value = currentText
        editInput.style.cssText =  `
            
            width: 9em;
            padding: 2px;
            border: 2px solid #007bff;
            font-size: 16px;
            background: white;
        `

        textSpan.replaceWith(editInput)
        editInput.select()
        editInput.focus()

        
        function saveEdit(){
            const newText = editInput.value.trim()

            if(newText === ''){
                restoreText()
                return
            }

            task.text = newText

            const newTextSpan = document.createElement('span')
            newTextSpan.className = 'todo-text'
            newTextSpan.id = task.id
            newTextSpan.textContent = newText

            if(task.status === 'completed'){
                newTextSpan.classList.add('completed')
            }

            editInput.replaceWith(newTextSpan)

            saveTasks()
        }

        function cancelEdit(){
            restoreText()
        }

        function restoreText(){
            const restoredTextSpan = document.createElement('span')
            restoredTextSpan.className = 'todo-text'
            restoredTextSpan.id = task.id
            restoredTextSpan.textContent = currentText

            if(task.status === 'completed'){
                restoredTextSpan.classList.add('completed')
            }

            editInput.replaceWith(restoredTextSpan)
        }

        editInput.addEventListener('keydown', function (e){
            if(e.key === 'Enter'){
                e.preventDefault()
                saveEdit()
            }

            else if(e.key === 'Escape'){
                e.preventDefault()
                cancelEdit()
            }
        })


        editInput.addEventListener('blur', function (){
            setTimeout(saveEdit, 100)
        })
    }

    

})